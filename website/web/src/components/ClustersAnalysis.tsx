'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Legend,
  BarChart, Bar, ScatterChart, Scatter, ZAxis, AreaChart, Area,
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import { Starburst } from './ComicElements';
import { ChevronDown, ChevronUp, TrendingUp, Info, Calendar, Zap, Search } from 'lucide-react';
import fullData from '@/data/clusters_data_full.json';
import rawContests from '@/data/contests_with_humor.json';
import timelineDataProcessed from '@/data/timeline_data_processed.json';
import sentimentTimelineProcessed from '@/data/sentiment_timeline_processed.json';



// --- Types ---
type SectionData = typeof fullData;

// --- Helper Components ---

const ComicBox = ({ children, className = '', title }: { children: React.ReactNode, className?: string, title?: string }) => (
  <div className={`border-4 border-[#1A1A1A] bg-white p-4 relative ${className}`} style={{ boxShadow: '6px 6px 0 #1A1A1A' }}>
    {title && (
      <div className="absolute -top-4 left-4 bg-[#F4A261] border-2 border-[#1A1A1A] px-3 py-1 z-10">
        <h3 className="comic-title text-xs font-bold text-[#1A1A1A]">{title}</h3>
      </div>
    )}
    {children}
  </div>
);

const SectionHeader = ({ title, subtitle }: { title: string, subtitle: string }) => (
  <div className="mb-8 mt-12 border-b-4 border-[#1A1A1A] pb-4">
    <div className="flex items-start gap-4">
      <div>
        <h2 className="comic-title text-3xl mb-1">{title}</h2>
        <p className="comic-text text-sm opacity-80 max-w-2xl">{subtitle}</p>
      </div>
    </div>
  </div>
);

const AnalysisText = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-[#FDFDF8] border-l-4 border-[#2A9D8F] p-4 my-4 font-mono text-xs leading-relaxed text-[#1A1A1A] opacity-90">
    {children}
  </div>
);

// --- Custom Heatmap Component ---
const Heatmap = ({ data }: { data: any[] }) => {
  const maxVal = Math.max(...data.flatMap(r => r.data.map((c: any) => c.y)));

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="p-1"></th>
            {data[0].data.map((col: any) => (
              <th key={col.x} className="p-1 text-[9px] comic-text rotate-45 text-left h-24 align-bottom whitespace-nowrap">
                {col.x}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row: any) => (
            <tr key={row.id}>
              <td className="p-1 text-[9px] comic-text text-right whitespace-nowrap font-bold pr-2">
                {row.name}
              </td>
              {row.data.map((cell: any) => {
                const intensity = cell.y / maxVal;
                // Generate color from light to dark teal
                const bg = `rgba(42, 157, 143, ${intensity * 0.9 + 0.1})`;
                return (
                  <td key={cell.x} className="p-0">
                    <motion.div
                      whileHover={{ scale: 1.1, zIndex: 10, borderColor: '#1A1A1A' }}
                      className="w-8 h-8 border border-white relative group"
                      style={{ backgroundColor: bg }}
                    >
                      <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 transform -translate-x-1/2 bg-[#1A1A1A] text-white text-[9px] px-1 py-0.5 rounded whitespace-nowrap pointer-events-none z-20">
                        {cell.y} overlap
                      </div>
                    </motion.div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};


function ExpandableExplanation({
  short,
  children,
}: {
  short: React.ReactNode;
  children: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="mt-3">
      {/* Short explanation (always visible) */}
      <p className="comic-text text-[12px] opacity-90 leading-snug">
        {short}
      </p>

      {/* Toggle */}
      <button
        onClick={() => setOpen(!open)}
        className="comic-title text-[11px] mt-1 underline opacity-70 hover:opacity-100 uppercase"
      >
        {open ? "HIDE EXPLANATION" : "READ MORE"}
      </button>

      {/* Long explanation */}
      {open && (
        <div className="mt-2">
          {children}
        </div>
      )}
    </div>
  );
}

// Map raw labels to display names and colors
const LABEL_MAPPING: Record<string, { name: string, color: string, description: string, icon: string }> = {
  'incongruity-absurdity': {
    name: "Incongruity & Absurdity",
    color: "#2A9D8F",
    description: "Things that don't match or are illogical.",
    icon: "🌀"
  },
  'wit-surprise': {
    name: "Wit & Surprise",
    color: "#457B9D",
    description: "Clever humor or unexpected twists.",
    icon: "✨"
  },
  'irony': {
    name: "Irony",
    color: "#E9C46A",
    description: "The expression of one's meaning by using language that normally signifies the opposite.",
    icon: "😏"
  },
  'sarcasm': {
    name: "Sarcasm",
    color: "#F4A261",
    description: "The use of irony to mock or convey contempt.",
    icon: "😒"
  },
  'exaggeration': {
    name: "Exaggeration",
    color: "#E76F51",
    description: "Representing something as better or worse than it really is.",
    icon: "😲"
  },
  'unknown': {
    name: "Unknown",
    color: "#A0A0A0",
    description: "Label could not be confidently determined.",
    icon: "❓"
  }
};

export function ClustersAnalysis() {
  const [distSource, setDistSource] = useState<'image_descriptions' | 'image_uncanny_descriptions' | 'questions'>('image_descriptions');
  const [sentimentSource, setSentimentSource] = useState<'image_descriptions' | 'image_uncanny_descriptions' | 'questions'>('image_descriptions');

  const data = fullData as unknown as SectionData;
  const { section1, section2, section3 } = data;

  // Dynamically calculate distributions from rawContests
  const pieData = useMemo(() => {
    const counts = {
      image_descriptions: {} as Record<string, number>,
      image_uncanny_descriptions: {} as Record<string, number>,
      questions: {} as Record<string, number>
    };

    // 1. Process Raw Data
    rawContests.forEach((contest: any) => {
      const labels = contest.metadata?.llm_humor_labels;
      if (!labels) return;

      (['image_descriptions', 'image_uncanny_descriptions', 'questions'] as const).forEach(key => {
        const list = labels[key];
        if (Array.isArray(list)) {
          list.forEach((rawLabel: string) => {
            const label = rawLabel.toLowerCase().trim();
            counts[key][label] = (counts[key][label] || 0) + 1;
          });
        }
      });
    });

    // 2. Format for Recharts
    const formatForChart = (sourceKey: keyof typeof counts) => {
      const sourceCounts = counts[sourceKey];
      const total = Object.values(sourceCounts).reduce((a, b) => a + b, 0);

      return Object.entries(sourceCounts)
        .map(([rawLabel, count]) => {
          const mapping = LABEL_MAPPING[rawLabel] || {
            name: rawLabel,
            color: "#999999",
            description: "",
            icon: ""
          };
          return {
            name: mapping.name,
            value: count,
            percentage: total > 0 ? Math.round((count / total) * 100) : 0,
            color: mapping.color,
            description: mapping.description,
            icon: mapping.icon
          };
        })
        .sort((a, b) => b.value - a.value);
    };

    return {
      image_descriptions: formatForChart('image_descriptions'),
      image_uncanny_descriptions: formatForChart('image_uncanny_descriptions'),
      questions: formatForChart('questions'),
    };
  }, []);

  // Calculate Engagement vs Popularity (Bar Chart)
  const engagementData = useMemo(() => {
    const categories = ['irony', 'sarcasm', 'exaggeration', 'incongruity-absurdity', 'wit-surprise', 'unknown'];
    const stats: Record<string, { captions: number[], votes: number[] }> = {};
    categories.forEach(c => stats[c] = { captions: [], votes: [] });

    rawContests.forEach((contest: any) => {
      const meta = contest.metadata || {};
      const labels = meta.llm_humor_labels || {};
      const numCaptions = meta.num_captions || 0;
      const numVotes = meta.num_votes || 0;

      const typesInContest = new Set<string>();
      (['image_descriptions', 'image_uncanny_descriptions', 'questions'] as const).forEach(key => {
        const list = labels[key] || [];
        if (Array.isArray(list)) {
          list.forEach((t: string) => typesInContest.add(t.toLowerCase().trim()));
        }
      });

      typesInContest.forEach(t => {
        if (stats[t]) {
          stats[t].captions.push(numCaptions);
          stats[t].votes.push(numVotes);
        }
      });
    });

    // Compute averages and normalize
    const rawResults = categories.map(cat => {
      const data = stats[cat];
      const avgCaptions = data.captions.length ? data.captions.reduce((a, b) => a + b, 0) / data.captions.length : 0;
      const avgVotes = data.votes.length ? data.votes.reduce((a, b) => a + b, 0) / data.votes.length : 0;
      return { id: cat, avgCaptions, avgVotes };
    });

    const maxCaptions = Math.max(...rawResults.map(r => r.avgCaptions));
    const maxVotes = Math.max(...rawResults.map(r => r.avgVotes));

    return rawResults
      .filter(r => r.avgVotes > 0 || r.avgCaptions > 0) // Filter out empty if any
      .map(r => {
        const mapping = LABEL_MAPPING[r.id] || { name: r.id };
        return {
          subject: mapping.name,
          votesRaw: Math.round(r.avgVotes),
          captionsRaw: Math.round(r.avgCaptions),
          votesScore: maxVotes > 0 ? (r.avgVotes / maxVotes) * 100 : 0,
          captionsScore: maxCaptions > 0 ? (r.avgCaptions / maxCaptions) * 100 : 0,
        };
      })
      .sort((a, b) => b.votesScore - a.votesScore); // Sort by popularity (votes)
  }, []);

  // Calculate Sentiment Analysis Data (Radar Chart) - Matches Python "Radial Analysis"
  const sentimentData = useMemo(() => {
    const fields = ['image_descriptions', 'image_uncanny_descriptions', 'questions'] as const;
    const sentiments = ['positive', 'neutral', 'negative'] as const;
    const humorTypes = ['irony', 'sarcasm', 'exaggeration', 'incongruity-absurdity', 'wit-surprise', 'unknown'];

    // Initialize 3D Matrix: field -> sentiment -> humorType -> count
    const stats: Record<string, Record<string, Record<string, number>>> = {};

    fields.forEach(f => {
      stats[f] = {};
      sentiments.forEach(s => {
        stats[f][s] = {};
        humorTypes.forEach(h => stats[f][s][h] = 0);
      });
    });

    // Aggregate Counts
    rawContests.forEach((contest: any) => {
      const meta = contest.metadata || {};
      const hl = meta.llm_humor_labels || {};
      const sl = meta.llm_sentiment || {};

      fields.forEach(field => {
        if (hl[field] && sl[field] && Array.isArray(hl[field]) && Array.isArray(sl[field])) {
          // Zip assumes alignment
          hl[field].forEach((hRaw: string, idx: number) => {
            const sRaw = sl[field][idx];
            if (!sRaw) return;

            const h = hRaw.toLowerCase().trim();
            const s = sRaw.toLowerCase().trim();

            if (stats[field][s] && stats[field][s][h] !== undefined) {
              stats[field][s][h]++;
            }
          });
        }
      });
    });

    // Normalize to Probabilities P(Humor | Sentiment)
    const result: Record<string, any[]> = {};

    fields.forEach(field => {
      const chartData = humorTypes.map(h => {
        const entry: any = { subject: LABEL_MAPPING[h]?.name || h };

        sentiments.forEach(s => {
          // Denominator: Total mentions of this sentiment in this field
          const totalSentimentCount = Object.values(stats[field][s]).reduce((a, b) => a + b, 0) || 1;
          const count = stats[field][s][h];
          entry[s] = (count / totalSentimentCount) * 100;
        });
        return entry;
      });
      result[field] = chartData;
    });

    return result;
  }, []);

  return (
    <div className="flex flex-col gap-8 pb-20">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h1
          className="comic-title"
          style={{
            fontSize: "40px",
            fontWeight: "bold",
            marginBottom: "8px",
            color: "#1A1A1A",
            lineHeight: 1.2
          }}
        >
          Distinct humor types identified through machine learning
        </h1>
      </div>

      {/* --- SECTION 1: GENERAL ANALYSIS --- */}
      <section>
        <SectionHeader
          title="The Landscape of Humor"
          subtitle="A comprehensive overview of the dominant humor types found in the dataset, characterized by machine learning models."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          <ComicBox title="Humor Type Distribution">
            <p className="text-xs font-mono mb-4 leading-relaxed opacity-80">
              In this section, we visualize the <strong>distribution of humor types</strong> predicted by the LLMs for each field of the <em>Cartoon Caption Contest</em> dataset (<code className="bg-gray-100 px-1 rounded">image_descriptions</code>, <code className="bg-gray-100 px-1 rounded">image_uncanny_descriptions</code>, and <code className="bg-gray-100 px-1 rounded">questions</code>).
              This helps us understand which kinds of humor dominate across the dataset. The classifications were generated using a fine-tuned <strong>Llama 3-8B</strong> model. <span style={{ color: '#9CA3AF', fontSize: '10px' }}>(Use your cursor over the chart segments to see details)</span>
            </p>

            <div className="flex gap-2 mb-2 justify-center">
              {[
                { id: 'image_descriptions', label: 'Image Description' },
                { id: 'image_uncanny_descriptions', label: 'Uncanny Description' },
                { id: 'questions', label: 'Questions' }
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setDistSource(opt.id as any)}
                  className="interactive-cta transition-colors"
                  style={{
                    backgroundColor: distSource === opt.id ? '#E63946' : 'white',
                    color: distSource === opt.id ? 'white' : '#1A1A1A'
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            <div className="text-center mb-4">
              <span style={{ color: '#9CA3AF', fontSize: '10px' }}>(Click buttons to switch analysis source)</span>
            </div>
            <div className="relative">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData[distSource]}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={false}
                    labelLine={false}
                  >
                    {pieData[distSource].map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="#1A1A1A" strokeWidth={2} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ border: '3px solid #1A1A1A', boxShadow: '4px 4px 0 #1A1A1A' }}
                    itemStyle={{ fontFamily: 'monospace' }}
                    formatter={(value: any, name: any, item: any) => [`${value} (${item.payload.percentage}%)`, name]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <ExpandableExplanation
              short="The distribution of humor in high-ranking captions reveals a distinct preference for Incongruity & Absurdity..."
            >
              <AnalysisText>
                {(() => {
                  const currentDist = pieData[distSource];
                  const unknown = currentDist.find((d: any) => d.name === 'Unknown');
                  const unknownPct = unknown?.percentage || 0;

                  // Get the top NON-unknown category for context
                  const topClassified = currentDist.find((d: any) => d.name !== 'Unknown') || currentDist[0];

                  if (distSource === 'image_descriptions') {
                    return (
                      <>
                        The substantial prevalence of <strong>Unknown</strong> labels (<strong>{unknownPct}%</strong>) in Image Descriptions highlights a nuance in machine valuation: the LLM frequently struggles to categorize the latent humor in purely factual setups. Unlike punchlines, these descriptions merely set the stage. However, where the model detects a signal, it correctly aligns with the contest's nature, identifying <strong>{topClassified?.name}</strong> (<strong>{topClassified?.percentage}%</strong>) as the primary foundational element of the visual joke.
                      </>
                    );
                  } else if (distSource === 'image_uncanny_descriptions') {
                    return (
                      <>
                        In <strong>Uncanny Descriptions</strong>, the signal is far clearer. The model strongly associates these inputs with <strong>{topClassified?.name}</strong>, which aligns perfectly with classical theories of humor. By explicitly isolating the visual anomaly (the "weird" thing), these descriptions provide a structural dissonance that is mathematically easier for the LLM to classify than the broader context, leading to stronger confidence and fewer ambiguous labels.
                      </>
                    );
                  } else {
                    return (
                      <>
                        The <strong>Questions</strong> category often reverts to an <strong>Unknown</strong> label (<strong>{unknownPct}%</strong>), suggesting that inquisitive syntax confuses standard humor classifiers. A rhetorical question like <em>"Why is he holding that?"</em> functions to point out absurdity, but lacks the declarative structure of Sarcasm or Irony. The model effectively interprets this "seeking of information" as humorless, missing the rhetorical intent behind the inquiry.
                      </>
                    );
                  }
                })()}
              </AnalysisText>
            </ExpandableExplanation>
          </ComicBox>

          {/* Chart 1.2: Radar Profile */}
          <ComicBox title="Humor Engagement Profiles">
            <p className="text-xs font-mono mb-4 leading-relaxed opacity-80">
              This chart profiles each humor type based on <strong>Popularity</strong> (average votes) and <strong>Engagement</strong> (average submitted captions). We compare normalized scores to see which types drive passive appreciation versus active participation.
            </p>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={engagementData} margin={{ top: 20, right: 30, left: 20, bottom: 50 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" vertical={false} />
                <XAxis dataKey="subject" tick={{ fontSize: 10, fontFamily: 'monospace' }} interval={0} angle={-20} textAnchor="end" />
                <YAxis hide />
                <Tooltip
                  contentStyle={{ border: '2px solid #1A1A1A', fontFamily: 'monospace' }}
                  cursor={{ fill: '#f0f0f0' }}
                  formatter={(value: any, name: any, props: any) => {
                    if (name === 'Popularity') return [props.payload.votesRaw.toLocaleString(), 'Avg Votes'];
                    if (name === 'Engagement') return [props.payload.captionsRaw.toLocaleString(), 'Avg Captions'];
                    return [value, name];
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '20px' }} />
                <Bar name="Popularity" dataKey="votesScore" fill="#2A9D8F" radius={[4, 4, 0, 0]} />
                <Bar name="Engagement" dataKey="captionsScore" fill="#264653" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <ExpandableExplanation
              short="Comparing engagement metrics reveals interesting trade-offs between popularity (votes) and active participation (captions)..."
            >
              <AnalysisText>
                {(() => {
                  const sortedByCaptions = [...engagementData].sort((a, b) => b.captionsRaw - a.captionsRaw);
                  const sortedByVotes = [...engagementData].sort((a, b) => b.votesRaw - a.votesRaw);

                  const mostEngaging = sortedByCaptions[0];
                  const mostPopular = sortedByVotes[0];

                  return (
                    <>
                      The data reveals a fascinating divergence between participation and appreciation. <strong>{mostEngaging?.subject}</strong> elicits the highest creative output ({mostEngaging?.captionsRaw.toLocaleString()} avg. captions), suggesting that visual hyperboles powerfully stimulate user creativity. However, the audience reserves its highest praise for <strong>{mostPopular?.subject}</strong> ({mostPopular?.votesRaw.toLocaleString()} avg. votes). This confirms a key community driver: while pure absurdity invites us to <em>play</em>, we ultimately reward the intellectual satisfaction of <em>structural wit</em> and layered contradictions.
                    </>
                  );
                })()}
              </AnalysisText>
            </ExpandableExplanation>
          </ComicBox>
        </div>
      </section>


      {/* --- SECTION 2: TEMPORAL EVOLUTION --- */}
      <section>
        <SectionHeader
          title="Evolution & Contests"
          subtitle="How humor preferences have shifted over time (2016-2023), correlated with real-world dates and contest events."
        />

        {/* Chart 2.1: Stacked Area Evolution */}
        <ComicBox title="Temporal Shifts in Humor Types" className="mb-8">
          <p className="text-xs font-mono mb-6 leading-relaxed opacity-80 border-b border-gray-200 pb-4">
            This chart tracks the prevalence of each humor category from 2016 to 2023 based on the analysis of the <strong>top 30 most-voted captions</strong> for every contest. We classified these high-ranking captions using LLMs and linked each contest to its precise publication date. This longitudinal approach allows us to detect if editorial preferences or reader tastes have shifted—for instance, favoring <strong>Irony</strong> or <strong>Incongruity</strong>—over specific time periods.
          </p>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart
              data={timelineDataProcessed}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 10 }}
                tickFormatter={(str) => new Date(str).getFullYear().toString()}
                minTickGap={30}
              />
              <YAxis tick={{ fontSize: 10 }} label={{ value: 'Frequency (%)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' } }} />
              <Tooltip
                contentStyle={{ border: '2px solid #1A1A1A' }}
                labelFormatter={(label) => new Date(label).toLocaleDateString()}
                formatter={(val: number) => val ? `${val.toFixed(1)}%` : '0%'}
              />
              <Legend verticalAlign="top" height={36} />

              {/* Plot lines for each category defined in LABEL_MAPPING */}
              {Object.entries(LABEL_MAPPING).map(([key, info]) => (
                <Line
                  key={key}
                  type="monotone"
                  dataKey={key}
                  name={info.name}
                  stroke={info.color}
                  strokeWidth={2}
                  dot={false}
                  connectNulls={true}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
          <ExpandableExplanation
            short="The smoothed signal reveals a distinct and stable stratification of humor types over the seven-year period, with Sarcasm maintaining persistent dominance..."
          >
            <AnalysisText>
              The smoothed signal reveals a distinct and stable <strong>stratification</strong> of humor types over the seven-year period. <strong>Sarcasm</strong> maintains persistent dominance, consistently accounting for 30-50% of the top-rated captions. A secondary cluster comprising <strong>Incongruity</strong>, <strong>Irony</strong>, and <strong>Wit</strong> generally oscillates between 10% and 20%, showing high temporal correlation with one another. <strong>Exaggeration</strong> remains a marginal category (&lt;10%), though it momentarily surpasses <strong>Wit & Surprise</strong> in early 2017 and mid-2020. Crucially, no regime shift is observed; the hierarchical ordering of these preferences remains structurally robust despite local volatility.
            </AnalysisText>
          </ExpandableExplanation>
        </ComicBox>

        {/* Section 2.2: Sentiment Analysis */}
        <div className="grid grid-cols-1 gap-6">
          <ComicBox title="🎭 The Emotional Spectrum of Humor">
            <p className="text-xs font-mono mb-6 leading-relaxed opacity-80 border-b border-gray-200 pb-4">
              In this section, we visualize the distribution of sentiment tones <strong>(Positive, Neutral, Negative)</strong> predicted by the LLMs for each field of the Cartoon Caption Contest dataset (image_descriptions, image_uncanny_descriptions, and questions). This helps us understand the emotional tendencies underlying the dataset and how the "mood" shifts across different content types. The classifications were generated using a fine-tuned RoBERTa model.
            </p>

            <div className="flex flex-col gap-8">



              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Chart 1: Radar Chart (Kiviat) - Sentiment Profile by Cluster */}
                <div className="border-4 border-[#1A1A1A] bg-white p-4" style={{ boxShadow: '4px 4px 0 #1A1A1A' }}>
                  <div className="bg-[#E63946] text-white px-2 py-1 inline-block mb-4 border-2 border-[#1A1A1A] transform -rotate-1">
                    <h4 className="comic-title text-sm">Emotional Profile by Humor Type</h4>
                  </div>

                  {/* Buttons to select Sentiment Source */}
                  <div className="flex flex-col items-center mb-6">
                    <div className="flex gap-2 mb-2 justify-center">
                      {[
                        { id: 'image_descriptions', label: 'Image Description' },
                        { id: 'image_uncanny_descriptions', label: 'Uncanny Description' },
                        { id: 'questions', label: 'Questions' }
                      ].map((opt) => (
                        <button
                          key={opt.id}
                          onClick={() => setSentimentSource(opt.id as any)}
                          className="interactive-cta transition-colors"
                          style={{
                            backgroundColor: sentimentSource === opt.id ? '#E63946' : 'white',
                            color: sentimentSource === opt.id ? 'white' : '#1A1A1A'
                          }}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                    <span style={{ color: '#9CA3AF', fontSize: '10px' }}>(Click buttons to switch analysis source)</span>
                  </div>

                  <ResponsiveContainer width="100%" height={350}>
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={sentimentData[sentimentSource]}>
                      <PolarGrid stroke="#1A1A1A" strokeDasharray="3 3" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: '#1A1A1A', fontSize: 10, fontWeight: 'bold' }} />
                      <PolarRadiusAxis angle={30} domain={[0, 50]} tickCount={6} tick={{ fill: '#1A1A1A', fontSize: 10 }} />

                      <Radar name="Positive 😊" dataKey="positive" stroke="#2A9D8F" strokeWidth={2} fill="#2A9D8F" fillOpacity={0.3} />
                      <Radar name="Neutral 😐" dataKey="neutral" stroke="#F4A261" strokeWidth={2} fill="#F4A261" fillOpacity={0.3} />
                      <Radar name="Negative 😠" dataKey="negative" stroke="#E63946" strokeWidth={2} fill="#E63946" fillOpacity={0.3} />

                      <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                      <Tooltip
                        formatter={(val: number) => `${val.toFixed(1)}%`}
                        contentStyle={{ border: '2px solid #1A1A1A', fontSize: '12px' }}
                        itemStyle={{ color: '#1A1A1A' }}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                  <div className="mt-6 border-t border-dashed border-gray-300 pt-4">
                    <ExpandableExplanation
                      short="The analysis reveals distinct humor-sentiment couplings across input types, with Incongruity dominating negative uncanniness..."
                    >
                      <AnalysisText>
                        The analysis reveals distinct humor-sentiment couplings across input types:
                        <ul className="list-disc pl-4 mt-2 space-y-2">
                          <li>
                            <strong>Uncanny Descriptions:</strong> This field exhibits the strongest structural signal. <strong>Incongruity & Absurdity</strong> is the dominant scaffold for both Neutral and Negative sentiments, quantitatively supporting the theory that "uncanniness" arises from cognitive dissonance rather than warm affect.
                          </li>
                          <li>
                            <strong>Factual Descriptions:</strong> This field is characterized by ambiguity. While <strong>Unknown</strong> labels dominate Neutral and Negative tones, distinct <strong>Irony</strong> emerges specifically within Positive contexts, suggesting that successfully detected descriptive humor often carries a lighter tone.
                          </li>
                          <li>
                            <strong>Questions:</strong> The inquisitive modality is largely opaque to sentiment analysis, with <strong>Unknown</strong> classification overwhelming the distribution across all non-positive valences.
                          </li>
                        </ul>
                      </AnalysisText>
                    </ExpandableExplanation>
                  </div>
                </div>

                {/* Chart 2: Evolution of Negativity */}
                {/* Chart 2: Evolution of Negativity */}
                <div className="border-4 border-[#1A1A1A] bg-white p-4" style={{ boxShadow: '4px 4px 0 #1A1A1A' }}>
                  <div className="bg-[#2A9D8F] text-white px-2 py-1 inline-block mb-4 border-2 border-[#1A1A1A] transform rotate-1">
                    <h4 className="comic-title text-sm">The "Cynicism Index" (2016-2023)</h4>
                  </div>

                  <p className="text-xs font-mono mb-4 leading-relaxed opacity-80 border-b border-dashed border-gray-200 pb-2">
                    To measure the true pulse of societal humor, we analyze the top 30 captions from every single contest between 2016 and 2023. By aggregating thousands of finalists, we track year-over-year shifts in emotional tone. This allows us to answer a key question: Does the world get meaner when times get tough?
                  </p>

                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart
                      data={sentimentTimelineProcessed}
                      margin={{ left: 0, top: 10, right: 30 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                      <XAxis
                        dataKey="date"
                        tick={{ fontSize: 10 }}
                        tickFormatter={(str) => new Date(str).getFullYear().toString()}
                        minTickGap={30}
                      />
                      <YAxis tick={{ fontSize: 10 }} unit="%" domain={[0, 100]} />
                      <Tooltip
                        contentStyle={{ border: '2px solid #1A1A1A' }}
                        labelFormatter={(label) => new Date(label).toLocaleDateString()}
                        formatter={(val: number) => val ? `${val.toFixed(1)}%` : '0%'}
                      />
                      <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '12px' }} />

                      <Line type="monotone" dataKey="negative" name="Negative 😠" stroke="#E63946" strokeWidth={2} dot={false} connectNulls />
                      <Line type="monotone" dataKey="neutral" name="Neutral 😐" stroke="#F4A261" strokeWidth={2} dot={false} connectNulls />
                      <Line type="monotone" dataKey="positive" name="Positive 😊" stroke="#2A9D8F" strokeWidth={2} dot={false} connectNulls />
                    </LineChart>
                  </ResponsiveContainer>

                  <div className="mt-6 border-t border-dashed border-gray-300 pt-4">
                    <ExpandableExplanation
                      short="The longitudinal trace reveals a homeostatic stability in emotional tone, with Neutral valence remaining the dominant signal..."
                    >
                      <AnalysisText>
                        Contrary to the expectation of volatile reactive humor, the longitudinal trace reveals a <strong>homeostatic stability</strong> in emotional tone. The <strong>Neutral</strong> valence remains the dominant carrier signal (&gt;50%), reflecting the publication's signature dry wit. While minor oscillations occur, there is no statistically significant secular trend towards <strong>Cynicism</strong> (Negative) or <strong>Escapism</strong> (Positive), suggesting the contest's emotional baseline is structurally fixed rather than reactive to current events.
                      </AnalysisText>
                    </ExpandableExplanation>
                  </div>
                </div>
              </div>
            </div>
          </ComicBox>
        </div>
      </section>

      {/* Section 3: Conclusion & Synthesis */}
      <section className="mb-12">
        <SectionHeader
          title="CONCLUSION"
          subtitle=""
        />
        <ComicBox title="">
          <div className="text-sm text-justify leading-relaxed opacity-90">
            <p>
              Based on our methodology and the findings of <a href="https://ceur-ws.org/Vol-3740/paper-183.pdf" target="_blank" rel="noopener noreferrer" className="underline hover:text-red-500">Wu et al.</a>, Large Language Models are not yet reliably capable of classifying humor for generalized use. While fine-tuning shows promise—with Llama 3 achieving nearly 90% accuracy during development—performance decreases significantly on unseen test data due to overfitting and confusion between nuanced categories like Irony and Sarcasm. Furthermore, contrary to the hypothesis that humor evolves rapidly with world events, our longitudinal analysis reveals a structural stability in the <em>New Yorker</em>'s humor. The dominance of Sarcasm and Neutrality remains constant trends, unaffected by political shifts or global crises (e.g., COVID-19), suggesting that the publication's style is a fixed cultural institution rather than a reactive mirror of current events.
            </p>
          </div>
        </ComicBox>
      </section>

    </div>
  );
}
