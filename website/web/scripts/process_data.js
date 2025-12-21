const fs = require('fs');
const path = require('path');
// Papaparse removed, using local simple parser

// Simple CSV parser
function parseCSV(csvText) {
    if (!csvText) return [];
    const lines = csvText.trim().split('\n');
    if (lines.length < 2) return [];
    const headers = lines[0].split(',').map(h => h.trim());
    return lines.slice(1).map(line => {
        // Handle quoted values (e.g. "a, b", c) - very basic implementation
        const values = [];
        let current = '';
        let inQuote = false;
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            if (char === '"') { inQuote = !inQuote; }
            else if (char === ',' && !inQuote) {
                values.push(current);
                current = '';
            } else {
                current += char;
            }
        }
        values.push(current);

        return headers.reduce((obj, header, index) => {
            // strip quotes from value if present
            let val = values[index] ? values[index].trim() : '';
            if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
            obj[header] = val;
            return obj;
        }, {});
    });
}

function processData() {
    const baseDir = path.join(__dirname, '../src/data');
    const weeklyPath = path.join(baseDir, 'humor_types/weekly_humor_types_contest_level.csv');
    const tokensPath = path.join(baseDir, 'humor_types/tokens_labeled_all.csv');
    const contestsPath = path.join(baseDir, 'contests_with_humor.json');
    const dfCompletePath = path.join(baseDir, 'df_complete.csv');

    console.log('Reading files...');
    const weeklyData = parseCSV(fs.readFileSync(weeklyPath, 'utf8'));
    const tokensData = parseCSV(fs.readFileSync(tokensPath, 'utf8'));
    const contestsData = JSON.parse(fs.readFileSync(contestsPath, 'utf8'));
    const dfComplete = parseCSV(fs.readFileSync(dfCompletePath, 'utf8'));

    // Map: Contest ID -> Date (from df_complete)
    // df_complete has 'contest_id' and 'date'
    const contestDateMap = {};
    dfComplete.forEach(row => {
        if (row.contest_id && row.date) {
            contestDateMap[row.contest_id] = row.date;
        }
    });

    const categoryConfig = {
        'irony': { name: 'Irony', color: '#E9C46A', icon: '😏', description: 'The expression of one\'s meaning by using language that normally signifies the opposite.' },
        'sarcasm': { name: 'Sarcasm', color: '#F4A261', icon: '😒', description: 'The use of irony to mock or convey contempt.' },
        'exaggeration': { name: 'Exaggeration', color: '#E76F51', icon: '😲', description: 'Representing something as better or worse than it really is.' },
        'incongruity_absurdity': { name: 'Incongruity & Absurdity', color: '#2A9D8F', icon: '🌀', description: 'Things that don\'t match or are illogical.' },
        'wit_surprise': { name: 'Wit & Surprise', color: '#457B9D', icon: '✨', description: 'Clever humor or unexpected twists.' }
    };

    /**
     * PROCESS CONTESTS DATA
     * Link contests to their primary humor type using simple heuristic 
     * (most frequent label in LLM analysis)
     */
    const processedContests = [];

    // New separate distributions
    const distImageDescriptions = {};
    const distUncannyDescriptions = {};
    const distQuestions = {};
    let totalImageDesc = 0;
    let totalUncannyDesc = 0;
    let totalQuestions = 0;

    // Helper for normalization
    const normalizeLabel = (l) => {
        let normalized = l.toLowerCase().trim().replace(/[\s-]/g, '_');
        return categoryConfig[normalized] ? normalized : null;
    };

    contestsData.forEach(contest => {
        const hLabels = contest.metadata.llm_humor_labels;
        if (!hLabels) return;

        // 1. Process specific fields for distributions
        const processField = (field, targetDist, totalCounter) => {
            const labels = hLabels[field] || [];
            let count = 0;
            labels.forEach(l => {
                if (l === 'unknown') return;
                const normalized = normalizeLabel(l);
                if (normalized && categoryConfig[normalized]) {
                    targetDist[normalized] = (targetDist[normalized] || 0) + 1;
                    count++;
                }
            });
            return count;
        };

        totalImageDesc += processField('image_descriptions', distImageDescriptions, totalImageDesc);
        totalUncannyDesc += processField('image_uncanny_descriptions', distUncannyDescriptions, totalUncannyDesc);
        totalQuestions += processField('questions', distQuestions, totalQuestions);
    });

    // --- POPULATE TIMELINE & EXAMPLES STRICTLY FROM CSVs ---
    // User Request: Use only df_complete and data_with_llm_top30 for timeline.
    dfComplete.forEach(row => {
        const cid = String(row.contest_id);
        if (!cid) return;

        const csvPath = path.join(baseDir, `data_with_llm_top30/${cid}.csv`);
        if (fs.existsSync(csvPath)) {
            try {
                const csvContent = fs.readFileSync(csvPath, 'utf8');
                const rows = parseCSV(csvContent);
                const counts = {};
                rows.forEach(r => {
                    const l = r.llm_humor_labels;
                    if (l && l !== 'unknown') {
                        const n = normalizeLabel(l);
                        if (n) counts[n] = (counts[n] || 0) + 1;
                    }
                });

                let maxLabel = null;
                let maxCount = 0;
                Object.entries(counts).forEach(([l, c]) => {
                    if (c > maxCount) { maxCount = c; maxLabel = l; }
                });

                if (maxLabel && categoryConfig[maxLabel]) {
                    processedContests.push({
                        id: cid,
                        title: `Contest ${cid}`,
                        date: row.date || '2016-01-01',
                        type: maxLabel,
                        description: rows[0]?.caption || "No description",
                        voteCount: row['Number of votes'] || 0
                    });
                }
            } catch (e) {
                // ignore
            }
        }
    });

    // --- SECTION 1: GENERAL ANALYSIS ---
    const formatDist = (distObj, total) => Object.keys(categoryConfig).map(key => ({
        name: categoryConfig[key].name,
        value: distObj[key] || 0,
        percentage: total > 0 ? Math.round(((distObj[key] || 0) / total) * 100) : 0,
        color: categoryConfig[key].color,
        description: categoryConfig[key].description,
        icon: categoryConfig[key].icon
    })).sort((a, b) => b.value - a.value);

    // --- METRICS FOR RADAR CHART ---
    const metricsResult = {};
    Object.keys(categoryConfig).forEach(k => {
        metricsResult[k] = {
            voteCountSum: 0,
            captionCountSum: 0,
            contestCount: 0,
            wordLengthSum: 0,
            wordCount: 0
        };
    });

    // Existing logic for contests_with_humor.json
    contestsData.forEach(contest => {
        const labels = contest.metadata.llm_humor_labels?.image_descriptions || [];
        let type = null;
        for (const l of labels) {
            const n = normalizeLabel(l);
            if (n) { type = n; break; }
        }

        if (type && metricsResult[type]) {
            metricsResult[type].contestCount++;
            metricsResult[type].voteCountSum += (parseInt(contest.metadata.num_votes) || 0);
            metricsResult[type].captionCountSum += (parseInt(contest.metadata.num_captions) || 0);
        }
    });

    // --- ENHANCEMENT: Scan data_with_llm_top30 for missing contests (e.g. 2023) ---
    // This ensures we get data even if it's missing from contests_with_humor.json
    const processedIdsInMetrics = new Set(contestsData.map(c => String(c.contest_id)));

    dfComplete.forEach(row => {
        const cid = String(row.contest_id);
        if (!cid || processedIdsInMetrics.has(cid)) return;

        const csvPath = path.join(baseDir, `data_with_llm_top30/${cid}.csv`);
        if (fs.existsSync(csvPath)) {
            try {
                const csvContent = fs.readFileSync(csvPath, 'utf8');
                const rows = parseCSV(csvContent);

                // Determine dominant humor type from top 30 captions
                const counts = {};
                rows.forEach(r => {
                    const l = r.llm_humor_labels;
                    if (l && l !== 'unknown') {
                        const n = normalizeLabel(l);
                        if (n) counts[n] = (counts[n] || 0) + 1;
                    }
                });

                let maxLabel = null;
                let maxCount = 0;
                Object.entries(counts).forEach(([l, c]) => {
                    if (c > maxCount) { maxCount = c; maxLabel = l; }
                });

                if (maxLabel && metricsResult[maxLabel]) {
                    metricsResult[maxLabel].contestCount++;
                    metricsResult[maxLabel].voteCountSum += (parseInt(row['Number of votes']) || 0);
                    metricsResult[maxLabel].captionCountSum += (parseInt(row.num_captions) || 0);

                    // Add to processedContests (Timeline) as well
                    // Note: We need to push to processedContests array too, but that array is local to
                    // the Section 2 block below. We should probably unify this.
                    // Actually, processedContests is used for Timeline and Examples. 
                    // Let's defer adding to processedContests until we reach that block, 
                    // OR we modify the structure to populate a global list first.
                    // For now, let's just update Metrics here. 
                    // AND WE MUST UPDATE processedContests separately below.
                }
            } catch (e) {
                // ignore
            }
        }
    });


    // --- DESC/QUESTION SENTIMENT AGGREGATION ---
    const descriptionSentiment = {
        image_descriptions: { positive: 0, neutral: 0, negative: 0, total: 0 },
        image_uncanny_descriptions: { positive: 0, neutral: 0, negative: 0, total: 0 },
        questions: { positive: 0, neutral: 0, negative: 0, total: 0 }
    };

    contestsData.forEach(contest => {
        const sentiments = contest.metadata.llm_sentiment;
        if (sentiments) {
            ['image_descriptions', 'image_uncanny_descriptions', 'questions'].forEach(field => {
                const labels = sentiments[field] || [];
                labels.forEach(l => {
                    const s = l.toLowerCase();
                    if (descriptionSentiment[field][s] !== undefined) {
                        descriptionSentiment[field][s]++;
                        descriptionSentiment[field].total++;
                    }
                });
            });
        }
    });

    // --- SENTIMENT ANALYSIS AGGREGATION (CAPTIONS) ---
    const sentimentByCluster = {};
    const sentimentByYear = {};
    const sentimentByClusterAndField = {}; // New detailed aggregation

    Object.keys(categoryConfig).forEach(k => {
        sentimentByCluster[k] = { positive: 0, neutral: 0, negative: 0, total: 0 };
        sentimentByClusterAndField[k] = {
            image_descriptions: { positive: 0, neutral: 0, negative: 0, total: 0 },
            image_uncanny_descriptions: { positive: 0, neutral: 0, negative: 0, total: 0 },
            questions: { positive: 0, neutral: 0, negative: 0, total: 0 }
        };
    });

    // We process ALL contests in dfComplete to get the most comprehensive sentiment data
    dfComplete.forEach(row => {
        const cid = String(row.contest_id);
        if (!cid) return;

        // Extract year from date
        const dateStr = row.date || '2016-01-01';
        const year = dateStr.split('-')[0];
        if (!sentimentByYear[year]) {
            sentimentByYear[year] = { positive: 0, neutral: 0, negative: 0, total: 0 };
        }

        // Get field-specific sentiments from metadata (contestsData) if available
        const contestMeta = contestsData.find(c => String(c.contest_id) === cid);
        const fieldSentiments = contestMeta?.metadata?.llm_sentiment || {};

        const csvPath = path.join(baseDir, `data_with_llm_top30/${cid}.csv`);
        if (fs.existsSync(csvPath)) {
            try {
                const csvContent = fs.readFileSync(csvPath, 'utf8');
                const rows = parseCSV(csvContent);

                rows.forEach(r => {
                    const humorLabel = normalizeLabel(r.llm_humor_labels);
                    const sentiment = r.llm_sentiment ? r.llm_sentiment.toLowerCase() : 'neutral';

                    // Update Cluster Sentiment (Global)
                    if (humorLabel && sentimentByCluster[humorLabel]) {
                        if (['positive', 'neutral', 'negative'].includes(sentiment)) {
                            sentimentByCluster[humorLabel][sentiment]++;
                            sentimentByCluster[humorLabel].total++;

                            // We can't easily link aggregated captions back to specific source fields 
                            // because captions are the result, not the source.
                            // BUT the user wants to filter by "Image Desc", "Uncanny", etc.
                            // These fields refer to the CONTEXT, not the caption itself.
                            // So we should probably aggregate the SENTIMENT OF THE CONTEXT fields by Cluster via the Contest.
                        }
                    }

                    // Update Year Sentiment
                    if (['positive', 'neutral', 'negative'].includes(sentiment)) {
                        sentimentByYear[year][sentiment]++;
                        sentimentByYear[year].total++;
                    }
                });

                // Now aggregate CONTEXT SENTIMENT by DOMINANT CLUSTER of the contest
                // 1. Find dominant cluster for this contest
                let maxLabel = null;
                let maxCount = 0;
                const counts = {};
                rows.forEach(r => {
                    const l = normalizeLabel(r.llm_humor_labels);
                    if (l) counts[l] = (counts[l] || 0) + 1;
                });
                Object.entries(counts).forEach(([l, c]) => {
                    if (c > maxCount) { maxCount = c; maxLabel = l; }
                });

                if (maxLabel && sentimentByClusterAndField[maxLabel]) {
                    // 2. Add this contest's context sentiments to the dominant cluster
                    ['image_descriptions', 'image_uncanny_descriptions', 'questions'].forEach(field => {
                        const labels = fieldSentiments[field] || [];
                        labels.forEach(l => {
                            const s = l.toLowerCase();
                            if (sentimentByClusterAndField[maxLabel][field][s] !== undefined) {
                                sentimentByClusterAndField[maxLabel][field][s]++;
                                sentimentByClusterAndField[maxLabel][field].total++;
                            }
                        });
                    });
                }

            } catch (e) {
                // ignore error
            }
        }
    });

    // 2. Calculate Complexity from Tokens (Avg Word Length weighted by score)
    const tokenTypeMap = {
        'absurd_surreal': 'incongruity_absurdity',
        'sarcasm_irony': 'sarcasm',
        'dark_humor': 'self_deprecating',
        'animals': 'wit_surprise',
        'relationship_family': 'exaggeration',
        'topical_political': 'irony',
        'workplace_office': 'sarcasm'
    };

    tokensData.forEach(row => {
        const rawType = row.humor_type;
        if (!rawType) return;

        if (rawType === 'sarcasm_irony') {
            ['sarcasm', 'irony'].forEach(k => {
                if (metricsResult[k]) {
                    const len = row.token ? row.token.length : 0;
                    const score = parseFloat(row.type_score) || 0;
                    metricsResult[k].wordLengthSum += len * score;
                    metricsResult[k].wordCount += score;
                }
            });
            return;
        }

        let targetKey = normalizeLabel(rawType);
        if (!targetKey && tokenTypeMap[rawType]) {
            targetKey = tokenTypeMap[rawType];
        }

        if (targetKey && metricsResult[targetKey]) {
            const len = row.token ? row.token.length : 0;
            const score = parseFloat(row.type_score) || 0;
            metricsResult[targetKey].wordLengthSum += len * score;
            metricsResult[targetKey].wordCount += score;
        }
    });

    // 3. Finalize and Normalize
    const radarData = Object.keys(categoryConfig).map(key => {
        const m = metricsResult[key];

        // Popularity (Avg Votes)
        const avgVotes = m.contestCount > 0 ? m.voteCountSum / m.contestCount : 0;
        const normVotes = Math.min(100, Math.max(0, avgVotes / 500)); // 50k = 100

        // Engagement (Avg Captions)
        const avgCaps = m.contestCount > 0 ? m.captionCountSum / m.contestCount : 0;
        const normCaps = Math.min(100, Math.max(0, avgCaps / 100)); // 10k = 100

        return {
            subject: categoryConfig[key].name,
            votesScore: parseFloat(normVotes.toFixed(2)),
            captionsScore: parseFloat(normCaps.toFixed(2)),
            votesRaw: Math.round(avgVotes),
            captionsRaw: Math.round(avgCaps),
            fullMark: 100
        };
    });

    const section1 = {
        distributions: {
            image_descriptions: formatDist(distImageDescriptions, totalImageDesc),
            image_uncanny_descriptions: formatDist(distUncannyDescriptions, totalUncannyDesc),
            questions: formatDist(distQuestions, totalQuestions)
        },
        radarData: radarData
    };


    // --- SECTION 2: CONTESTS & TIME ---
    // Group by Month/Year
    const timeMap = {};
    processedContests.forEach(c => {
        const d = new Date(c.date);
        if (isNaN(d.getTime())) return;
        const key = `${d.getFullYear()}`; // Group by Year for cleaner chart

        if (!timeMap[key]) {
            timeMap[key] = {};
            Object.keys(categoryConfig).forEach(k => timeMap[key][categoryConfig[k].name] = 0);
        }
        timeMap[key][categoryConfig[c.type].name]++;
    });

    const timelineData = Object.keys(timeMap).sort().map(year => {
        return {
            name: year,
            ...timeMap[year]
        };
    });

    const contestExamples = processedContests
        .sort((a, b) => b.voteCount - a.voteCount) // sort by popularity
        .slice(0, 50); // Keep top 50 for specific scatter plots/search


    // --- SECTION 3: ADVANCED / LEXICAL ---
    // Top words per category from tokensData
    const wordsByType = {};
    tokensData.forEach(row => {
        const type = row.humor_type;
        if (categoryConfig[type]) {
            if (!wordsByType[type]) wordsByType[type] = [];
            wordsByType[type].push({
                word: row.token,
                count: parseInt(row.count, 10),
                score: parseFloat(row.type_score)
            });
        }
    });

    const advancedData = Object.keys(categoryConfig).map(key => {
        const words = wordsByType[key] || [];
        const topWords = words.sort((a, b) => b.score - a.score).slice(0, 10);
        return {
            type: categoryConfig[key].name,
            color: categoryConfig[key].color,
            topWords: topWords.map(w => ({ text: w.word, value: w.score }))
        };
    });

    // Mock Co-occurrence matrix (how often types appear together in LLM labels)
    // We can calculate this from contestsData "counts" object if we preserved it
    // For now, let's just generate a plausible structure based on processedContests to avoid complexity
    // (Real implementation would use the multi-label nature of contests)

    // Using simple "Next To" logic? No, let's use the 'counts' map we built earlier per contest
    // We need to re-iterate contestsData to find overlap
    const coOccurence = {};
    Object.keys(categoryConfig).forEach(k1 => {
        coOccurence[k1] = {};
        Object.keys(categoryConfig).forEach(k2 => coOccurence[k1][k2] = 0);
    });

    contestsData.forEach(contest => {
        const labels = [
            ...(contest.metadata.llm_humor_labels?.image_descriptions || []),
            ...(contest.metadata.llm_humor_labels?.image_uncanny_descriptions || [])
        ];
        if (labels.length < 2) return;

        // rudimentary overlap
        const typesFound = new Set();
        labels.forEach(l => {
            let normalized = l.toLowerCase().replace('-', '_');
            if (normalized.includes('absurd')) normalized = 'absurd_surreal';
            else if (normalized.includes('irony')) normalized = 'sarcasm_irony';
            else if (normalized.includes('politic')) normalized = 'topical_political';
            else if (normalized.includes('work')) normalized = 'workplace_office';
            else if (normalized.includes('animal')) normalized = 'animals';
            else if (normalized.includes('family') || normalized.includes('dating')) normalized = 'relationship_family';
            else if (normalized.includes('dark')) normalized = 'dark_humor';
            else return;
            typesFound.add(normalized);
        });

        const typeArr = Array.from(typesFound);
        for (let i = 0; i < typeArr.length; i++) {
            for (let j = i + 1; j < typeArr.length; j++) {
                const t1 = typeArr[i];
                const t2 = typeArr[j];
                if (coOccurence[t1] && coOccurence[t1][t2] !== undefined) coOccurence[t1][t2]++;
                if (coOccurence[t2] && coOccurence[t2][t1] !== undefined) coOccurence[t2][t1]++;
            }
        }
    });

    const heatmapData = Object.keys(coOccurence).map(rowKey => {
        return {
            id: rowKey,
            name: categoryConfig[rowKey].name,
            data: Object.keys(coOccurence[rowKey]).map(colKey => ({
                x: categoryConfig[colKey].name,
                y: coOccurence[rowKey][colKey]
            }))
        };
    });


    // Final Output Structure
    const output = {
        section1, // General Stats
        section2: { // Time & Contests
            timelineData,
            examples: contestExamples
        },
        section3: { // Advanced
            lexical: advancedData,
            heatmap: heatmapData
        },
        sentimentAnalysis: {
            byCluster: sentimentByCluster,
            byYear: sentimentByYear,
            byField: descriptionSentiment,
            byClusterAndField: sentimentByClusterAndField
        }
    };

    fs.writeFileSync(path.join(baseDir, 'clusters_data_full.json'), JSON.stringify(output, null, 2));
    console.log('Successfully wrote clusters_data_full.json');
}

processData();
