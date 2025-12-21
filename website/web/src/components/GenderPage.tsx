import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Area, AreaChart } from 'recharts';
import { Starburst } from './ComicElements';
import { Users, TrendingUp, AlertCircle } from 'lucide-react';
import { useData } from '@/context/DataContext';
import gender_timeline from '@/data/gender_data/gendertime.json';
import climat_timeline from '@/data/gender_data/climate.json';
import covid_timeline from '@/data/gender_data/covid.json';
import war_timeline from '@/data/gender_data/war.json';
import trump_timeline from '@/data/gender_data/trump.json';
import humor_labels from '@/data/gender_data/gender_humor_labels.json';
import gender_sentiment from '@/data/gender_data/gender_sentiment.json';
import gender_eventgroupe from '@/data/gender_data/event_groups.json';
import word_counts from '@/data/gender_data/word_counts.json';
import trends_focusgroup from '@/data/gender_data/google_trends_focus_groups_timeseries.json';
import trends_zscore from '@/data/gender_data/google_trends_zscored_focus_groups.json';
import top_terms from '@/data/gender_data/top_terms.json';
import df_vc from '@/data/gender_data/df_vc.json';
type SectionData = typeof gender_timeline;



const ComicBox = ({ children, className = '', title }: { children: React.ReactNode, className?: string, title?: React.ReactNode }) => (
  <div className={`border-4 border-[#1A1A1A] bg-white p-4 relative ${className}`} style={{ boxShadow: '6px 6px 0 #1A1A1A' }}>
    {title && (
      <div className="absolute -top-4 left-4 bg-[#F4A261] border-2 border-[#1A1A1A] px-3 py-1 z-10">
        {typeof title === 'string' ? <h3 className="comic-title text-xs font-bold text-[#1A1A1A]">{title}</h3> : title}
      </div>
    )}
    {children}
  </div>
);

const AnalysisText = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-[#FDFDF8] border-l-4 border-[#2A9D8F] p-4 my-4 font-mono text-xs leading-relaxed text-[#1A1A1A] opacity-90">
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



export function GenderPage() {
  const [selectedView, setSelectedView] = useState<'timeline' | 'comparison' | 'gapRate'>('timeline');
  const { selectedCluster } = useData();
  // gender_timeline is an array of date points — use it directly as `section1`
  const section1 = gender_timeline as unknown as SectionData;

  // Moving average settings and computed fields
  const MA_WINDOW = 8; // window size in weeks
  const sectionWithMA = (section1 as any[]).map((d, i, arr) => {
    const start = Math.max(0, i - MA_WINDOW + 1);
    const slice = arr.slice(start, i + 1);
    const ma_man = Math.round(slice.reduce((s: number, x: any) => s + (x.man ?? 0), 0) / slice.length);
    const ma_woman = Math.round(slice.reduce((s: number, x: any) => s + (x.woman ?? 0), 0) / slice.length);
    return { ...d, ma_man, ma_woman };
  });

  // Plot data: cap plotted values at Y_CAP so spikes are visually cut at the top (no markers or annotations)
  const Y_CAP = 1000;
  const plotData = (sectionWithMA as any[]).map(d => ({
    ...d,
    plot_man: Math.min(d.man ?? 0, Y_CAP),
    plot_woman: Math.min(d.woman ?? 0, Y_CAP),
    plot_ma_man: Math.min(d.ma_man ?? 0, Y_CAP),
    plot_ma_woman: Math.min(d.ma_woman ?? 0, Y_CAP)
  }));

  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const toggleEvent = (ev: string) => setSelectedEvent(prev => (prev === ev ? null : ev));

  // Color palette for pies (consistent mapping)
  const COLORS = ['#E63946', '#F4A261', '#457B9D', '#2A9D8F', '#264653', '#A8DADC'];

  // Prepare pie-ready arrays for humor and sentiment by gender
  const humorMen = humor_labels.map((h: any, i: number) => ({ name: h.category, value: h.pct_man, percentage: h.pct_man, color: COLORS[i % COLORS.length] }));
  const humorWomen = humor_labels.map((h: any, i: number) => ({ name: h.category, value: h.pct_woman, percentage: h.pct_woman, color: COLORS[i % COLORS.length] }));

  const sentimentMen = gender_sentiment.map((s: any, i: number) => ({ name: s.category, value: s.pct_man, percentage: s.pct_man, color: COLORS[i % COLORS.length] }));
  const sentimentWomen = gender_sentiment.map((s: any, i: number) => ({ name: s.category, value: s.pct_woman, percentage: s.pct_woman, color: COLORS[i % COLORS.length] }));


  // Data for Box Plot
  /*const general_genderdata = general_genderdata.values.map((value, index) => ({
    name: `Data ${index + 1}`,
    value: value
  }));  
*/
  // Data for gender representation overall
  const COLOR_MAP: Record<string, string> = {
    women: '#2A9D8F',
    men: '#E63946',
    dino: '#bb9221ff',
    witch: '#6d319aff'
  };

  const general_genderdata = (word_counts as { word: string; count: number }[]).map(w => ({
    name: w.word,
    uv: w.count,
    color: COLOR_MAP[w.word] ?? '#264653'
  }));


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
          Gender Representation
        </h1>
      </div>



      {/* --- SECTION 1: GENERAL ANALYSIS Barplot overall --- */}
      <section>
        <p className="mb-4">
          The cartoons and their captions are generally funny, clever, and absurd, but they also quietly shape who 
          is seen, heard, and centered. When reading through caption after caption, it can start to feel like certain 
          characters are always in the foreground, while others rarely get the spotlight. That intuition is what 
          motivates this analysis: is gender represented fairly when it comes to who gets named, 
          described, or put at the center of the joke? 
        </p>

        <p>
          To move beyond gut feeling, this page looks at how often different word groups related to <strong>women</strong> and <strong>men</strong> appear 
          in the captions, and what kinds of characters they share the frame with.
        </p>

        {/* Top terms overall */}
        <ComicBox title="Top words in captions">
          <p className="text-xs font-mono mb-2 leading-relaxed opacity-80">
            The following bar chart shows the 50 most frequent single tokens across all captions. 
            This gives an idea of which words are most commonly used in the captions overall.
          </p>

          {/* Show all top terms with tighter bottom spacing */}
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={(top_terms as any[])} margin={{ top: 10, right: 24, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" vertical={false} />
              <XAxis dataKey="term" tick={{ fontSize: 10, fontFamily: 'monospace' }} interval={0} angle={-55} textAnchor="end" height={90} tickMargin={0} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip contentStyle={{ border: '2px solid #1A1A1A', fontFamily: 'monospace' }} formatter={(value: any) => [value, 'count']} />
              <Bar dataKey="count" fill="#8D5B4C" radius={[4,4,0,0]}>
                {(top_terms as any[]).map((entry: any) => (
                  <Cell key={`cell-top-${entry.term}`} fill="#8D5B4C" />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <p className="mb-4">
             In the first part of the plot, the most frequent terms are those used for men: 
             words like <strong>sir</strong>, <strong>guy</strong>, <strong>man</strong>, and <strong>guys</strong> dominate 
             the left side of the plot, and usually refer to a person in a broad, almost
            generic way. Further along the plot, the words used for women start to appear, but they look different. 
            Instead of neutral labels, they are often tied to family roles like <strong>wife</strong>, <strong>mother</strong>, and <strong>mom</strong>.
          </p>
          <p>
            Read together, these patterns suggest that men are more often portrayed as independent individuals,
            while women are more frequently defined by their relationships to others. 
            This subtle difference in language paints a striking picture of how gendered expectations seep into even
            the most light-hearted captions.
          </p>
        </ComicBox>

        <ComicBox title="Gender mentions distribution overall">
          <p className="text-xs font-mono mb-4 leading-relaxed opacity-80">
            The chart below shows how many times <strong>women</strong> and <strong>men</strong> are mentioned 
            across the captions. 
            Additionally, the frequency of appearance of <strong>dino</strong> and <strong>witch</strong> are shown as well. 
            Indeed, when taking a broad look at the cartoons, there seems to be more dinos and witches alone than images featuring
            a woman alone, which raises questions about whose identities are treated as default or central. With this analysis, 
            the goal here is to use the caption data to uncover a subtle pattern of social inequalities.
          </p>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={general_genderdata} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 10, fontFamily: 'monospace' }} interval={0} angle={-20} textAnchor="end" />
              <YAxis hide />
              <Tooltip
                contentStyle={{ border: '2px solid #1A1A1A', fontFamily: 'monospace' }}
                cursor={{ fill: '#f0f0f0' }}
              />
              <Bar name="mentions" dataKey="uv" radius={[4, 4, 0, 0]}>
                {general_genderdata.map((entry: any, index: number) => (
                  <Cell key={`cell-${entry.name}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <AnalysisText>
            <p className="mb-4">
              As visible in the bar chart, the imbalance in mentions of men and women are shocking.
              At a first glance, men are shown to be mentioned "only" twice as often as women, but looking 
              deeper into the raw numbers, there is a difference of almost <strong>30.000</strong> between 
              both counts.

            </p>

            <p>
              Meanwhile, mentions of <strong>dino</strong> and <strong>witch</strong> are present but 
              remain far below both gendered word groups, underscoring that, while non‑human or fantastical 
              characters do appear, human figures (especially men) still carry most of the narrative weight. 
              Taken together with the earlier motivation, these counts support the idea that even in a 
              seemingly apolitical, playful setting like the New Yorker Caption Contest, gender is far 
              from neutrally distributed: men are consistently foregrounded in language, while women are 
              comparatively sidelined.
            </p>
            To conclude this overview section, we can see that even an unpolitical caption contest shows 
            massive difference between the genders. This empathizes once more how social inequalities 
            are strongly enforced in society.
          </AnalysisText>
        </ComicBox>
      </section>

      {/* Toggle View */}
      <div className="flex justify-center gap-4 mb-6">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setSelectedView('timeline')}
          className="interactive-cta transition-colors"
          style={{
            backgroundColor: selectedView === 'timeline' ? '#E63946' : 'white',
            color: selectedView === 'timeline' ? 'white' : '#1A1A1A',
            boxShadow: '3px 3px 0 #1A1A1A'
          }}
        >
          General Timeline View
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setSelectedView('comparison')}
          className="interactive-cta transition-colors"
          style={{
            backgroundColor: selectedView === 'comparison' ? '#E63946' : 'white',
            color: selectedView === 'comparison' ? 'white' : '#1A1A1A',
            boxShadow: '3px 3px 0 #1A1A1A'
          }}
        >
          By Topic
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setSelectedView('gapRate')}
          className="interactive-cta transition-colors"
          style={{
            backgroundColor: selectedView === 'gapRate' ? '#E63946' : 'white',
            color: selectedView === 'gapRate' ? 'white' : '#1A1A1A',
            boxShadow: '3px 3px 0 #1A1A1A'
          }}
        >
          Differences
        </motion.button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 grid grid-cols-3 gap-6">
        {/* Chart Area - Takes 2 columns */}
        <motion.div
          key={selectedView}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="col-span-2 border-4 border-[#1A1A1A] bg-white p-6"
          style={{ boxShadow: '6px 6px 0 #1A1A1A' }}
        >
          <div className="inline-block mb-4 px-4 py-2 bg-[#457B9D] border-3 border-[#1A1A1A]">
            <h3 className="comic-title text-sm text-[#FDFDF8]">
              {selectedView === 'timeline'
                ? 'Gender Distribution Over Time'
                : selectedView === 'comparison'
                  ? 'Gender by Topic'
                  : 'Gender Differences'}
            </h3>
          </div>
          {/*Timeline View of only Gender Distribution Over Time*/}
          {selectedView === 'timeline' && (
            <ComicBox>
              <p className="text-xs font-mono mb-6 leading-relaxed opacity-80 border-b border-gray-200 pb-4">
                Here, the previous analysis is looked at on a timeline. Maybe there is a variation in time? Or maybe the inequality in mentions even decreased over time?
              </p>
              <p>
                Over the years, each peak and valley in this plot corresponds to a caption contest, showing how 
                often, male‑coded and female‑coded terms appear in that round. The timeline lets us step back and 
                see whether the gap between mentions of men and women is shrinking, widening, or simply staying put. 
                Instead of relying on a single snapshot, we can now watch gendered language play out across several 
                years of contests, almost like a heartbeat of who gets talked about.
              </p>
              {/* Single chart with linear Y axis capped at 1000 (cut) and moving averages emphasized */}
              <ResponsiveContainer width="100%" height={420}>
                <LineChart data={plotData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="dates" tick={{ fontSize: 10 }} />
                  <YAxis domain={[0, 1000]} allowDataOverflow={false} ticks={[0,200,400,600,800,1000]} tickFormatter={(v: any) => (Number.isFinite(v) ? Math.round(v).toString() : v)} tick={{ fontSize: 10 }} label={{ value: 'mentions of the genders', angle: -90, position: 'insideLeft' }} />
                  <Tooltip contentStyle={{ border: '2px solid #1A1A1A' }} formatter={(value: any, name: any) => [value, name]} />

                  {/* Raw series (thinner and semi-transparent) */}
                  <Line type="monotone" dataKey="plot_man" stroke="#E63946" dot={false} strokeWidth={2} strokeOpacity={0.5} strokeLinecap="round" name="man" />
                  <Line type="monotone" dataKey="plot_woman" stroke="#2A9D8F" dot={false} strokeWidth={2} strokeOpacity={0.5} strokeLinecap="round" name="woman" />

                  {/* Moving average (bold, solid, emphasized) */}
                  <Line type="monotone" dataKey="plot_ma_man" stroke="#E63946" dot={false} strokeWidth={4} strokeOpacity={1} strokeLinecap="round" name={`man (Average of ${MA_WINDOW} weeks)`} />
                  <Line type="monotone" dataKey="plot_ma_woman" stroke="#2A9D8F" dot={false} strokeWidth={4} strokeOpacity={1} strokeLinecap="round" name={`woman (Average of ${MA_WINDOW} weeks)`} />
                </LineChart>
              </ResponsiveContainer>
              <p className="text-xs font-mono mt-2 opacity-80"> <em>Note that the Y axis is linear and capped at 1000 to improve visibility of smaller values. Moving averages (bold solid lines) highlight the trend.</em></p>
              <AnalysisText>
                This graph shows that there is no variation happening. The inequality doesn't seem to change, and the moving averages for male‑coded 
                terms sit above those for female‑coded terms almost all along the timeline, suggesting that this is not an early‑years quirk but 
                a persistent habit of writing. What is even more striking to see is that the number of women's mentions overpasses the men's mentions 
                only a dozen of times… which underlines how rarely women are placed at the center of these jokes.
            </AnalysisText>
            </ComicBox>
          )}

          {/*Timeline View with combined data*/}
          {selectedView === 'comparison' && (
            <section>
              <ComicBox title="Eventgroup by Gender">
                <p className="text-xs font-mono mb-4 leading-relaxed opacity-80">
                  During the caption contest, different topics were analysed on its development over time. There are <strong>covid-pandemic</strong>, several <strong>wars</strong>, the presidency of Donald <strong>Trump</strong> and <strong>climate change</strong>. 
                  Each subject has its own mood, so the question is: does the topic change, who gets mentioned more often ? Let's see!
                </p>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={gender_eventgroupe} margin={{ top: 20, right: 30, left: 20, bottom: 50 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" vertical={false} />
                    <XAxis dataKey="event" tick={{ fontSize: 10, fontFamily: 'monospace' }} interval={0} angle={-20} textAnchor="end" />
                    <YAxis hide />
                    <Tooltip
                      contentStyle={{ border: '2px solid #1A1A1A', fontFamily: 'monospace' }}
                      cursor={{ fill: '#f0f0f0' }}
                    />

                    <Bar name="men" dataKey="df_man" radius={[4, 4, 0, 0]}>
                      {gender_eventgroupe.map((entry: any, index: number) => (
                        <Cell
                          key={`cell-man-${entry.event}`}
                          cursor="pointer"
                          onClick={() => toggleEvent(entry.event)}
                          fill={selectedEvent === entry.event ? '#98252fff' : '#E63946'}
                        />
                      ))}
                    </Bar>
                    <Bar name="woman" dataKey="df_woman" radius={[4, 4, 0, 0]}>
                      {gender_eventgroupe.map((entry: any, index: number) => (
                        <Cell
                          key={`cell-woman-${entry.event}`}
                          cursor="pointer"
                          onClick={() => toggleEvent(entry.event)}
                          fill={selectedEvent === entry.event ? '#185c54ff' : '#2A9D8F'}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: 8 }} className="text-xs font-mono">
                  <div className="flex items-center gap-2" title={selectedEvent ? `Event selected: ${selectedEvent}` : 'No event selected'}>
                    <span style={{ width: 12, height: 12, background: selectedEvent ? '#98252fff' : '#E63946', display: 'inline-block', border: selectedEvent ? '3px solid #1A1A1A' : '2px solid #1A1A1A', boxShadow: selectedEvent ? '0 0 6px rgba(230,57,70,0.18)' : 'none' }}></span>
                    <span className={selectedEvent ? 'font-semibold' : ''}>Men</span>
                  </div>
                  <div style={{ width: 24 }} />
                  <div className="flex items-center gap-2" title={selectedEvent ? `Event selected: ${selectedEvent}` : 'No event selected'}>
                    <span style={{ width: 12, height: 12, background: selectedEvent ? '#185c54ff' : '#2A9D8F', display: 'inline-block', border: selectedEvent ? '3px solid #1A1A1A' : '2px solid #1A1A1A', boxShadow: selectedEvent ? '0 0 6px rgba(214,90,62,0.18)' : 'none' }}></span>
                    <span className={selectedEvent ? 'font-semibold' : ''}>Women</span>
                  </div>
                </div>
                <p className="text-xs font-mono mt-2 mb-4 opacity-80">👆<i>Click any bar to view its detailed timeline below!</i></p>
                <AnalysisText>
                  The inequality in the mentions between the gender word groups remains for all topics: male‑coded words consistently 
                  appear more than female‑coded ones.                  
                   We can see that captions correlated with <strong>Trump</strong> have the <strong>lowest share</strong> of women-word mentions,
                    while <strong>climate change</strong> captions have the <strong>smallest gender gap</strong>, even if it is still present. 
                    <i>This might hint that certain topics are more open for a more equal discourse?</i> Unfortunately, after a <strong>chi-test</strong> one statistical evidence is shown and therefore the null hypothesis has to be accepted!
                </AnalysisText>
              </ComicBox>
              {selectedEvent === 'climate' && (
                <ComicBox title={<h3 className="comic-title text-xs font-bold" style={{ color: '#2A9D8F' }}>Climate change</h3>} className="mb-8">
                  <p className="text-xs font-mono mb-6 leading-relaxed opacity-80 border-b border-gray-200 pb-4">
                    The public perception around the climate crisis has shifted a lot between 2016 and 2023, especially since the rise of <strong>Fridays for Future</strong> and
                     Greta Thunberg’s activism in 2018. It is easy to imagine that this wave of climate awareness might also show up in a playful space like the 
                     caption contest: more climate jokes, more climate metaphors, more references to the crisis itself.
        
                  </p>
                  <ResponsiveContainer width="100%" height={350}>
                    <LineChart data={climat_timeline} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                      <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 5 }} label={{ value: 'caption percentage [%]', angle: -90 }} />
                      <Tooltip contentStyle={{ border: '2px solid #1A1A1A' }} formatter={(value: any, name: any, item: any) => [`${value}%`, name]} />
                      <Line type="bump" dataKey="ma_pct_man" stroke="#E63946" dot={false} strokeWidth={3} name="man" />
                      <Line type="bump" dataKey="ma_pct_woman" stroke="#2A9D8F" dot={false} strokeWidth={3} name="woman" />
                      <Line type="bump" dataKey="combined_pct" stroke="#264653" dot={false} strokeWidth={3} name="combined" />
                    </LineChart>
                  </ResponsiveContainer>
                  <AnalysisText>
                    In this timeline, each line tracks the share of captions about climate that use gendered word groups. 
                    Despite the changing public mood, the pattern looks familiar: male‑coded terms stay higher than female‑coded 
                    ones for almost the entire period of time. Also, there is a visible spike in climate‑related captions around early 2019, 
                    but this does not seem to have a lasting impact caused by <strong>Fridays for Future</strong>.
                  </AnalysisText>
                </ComicBox>
              )}

              {selectedEvent === 'covid' && (
                <ComicBox title={<h3 className="comic-title text-xs font-bold" style={{ color: '#E63946' }}>Covid</h3>} className="mb-8">
                  <p className="text-xs font-mono mb-6 leading-relaxed opacity-80 border-b border-gray-200 pb-4">
                    Then the pandemic began… 
                  </p>
                  <ResponsiveContainer width="100%" height={350}>
                    <LineChart data={covid_timeline} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                      <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 5 }} label={{ value: 'caption percentage [%]', angle: -90 }} />
                      <Tooltip contentStyle={{ border: '2px solid #1A1A1A' }} formatter={(value: any, name: any, item: any) => [`${value}%`, name]} />
                      <Line type="bump" dataKey="ma_pct_man" stroke="#E63946" dot={false} strokeWidth={3} name="man" />
                      <Line type="bump" dataKey="ma_pct_woman" stroke="#2A9D8F" dot={false} strokeWidth={3} name="woman" />
                      <Line type="bump" dataKey="combined_pct" stroke="#264653" dot={false} strokeWidth={3} name="combined" />
                    </LineChart>
                  </ResponsiveContainer>
                  <AnalysisText>
                    <p className="text-xs font-mono mb-6 leading-relaxed opacity-80 border-b border-gray-200 pb-4">
                       From one contest to the next, the covid‑related word group clearly spikes when the crisis hits, 
                       forming a distinct <i>covid phase</i> in the timeline. Before that, mentions are almost flat, 
                       apart from a few scattered references captured by words like <i>virus, vaccine, and mask.</i>
                    </p>
                    <p className="text-xs font-mono mb-6 leading-relaxed opacity-80 border-b border-gray-200 pb-4">
                       During the peak of the pandemic in <strong>spring 2020</strong>, something unusual happens: the curve for the women 
                       word group briefly rises above the one for men. It is a rare reversal in our data and it fades quickly, but it shows 
                       that when everything is upended, even long‑standing patterns of who gets talked about can temporarily shift.
                    </p>
                  </AnalysisText>
                </ComicBox>
              )}

              {selectedEvent === 'war' && (
                <ComicBox title={<h3 className="comic-title text-xs font-bold" style={{ color: '#8D5B4C' }}>War</h3>} className="mb-8">
                  <p className="text-xs font-mono mb-6 leading-relaxed opacity-80 border-b border-gray-200 pb-4">
                    Wars are deeply patriarchal spaces. This timeline asks whether that shows up in the 
                    caption contest too: when the topic leans toward war, do we see a gender gap in who gets mentioned?
                  </p>
                  <ResponsiveContainer width="100%" height={350}>
                    <LineChart data={war_timeline} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                      <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 5 }} label={{ value: 'caption percentage [%]', angle: -90 }} />
                      <Tooltip contentStyle={{ border: '2px solid #1A1A1A' }} formatter={(value: any, name: any, item: any) => [`${value}%`, name]} />
                      <Line type="bump" dataKey="ma_pct_man" stroke="#E63946" dot={false} strokeWidth={3} name="man" />
                      <Line type="bump" dataKey="ma_pct_woman" stroke="#2A9D8F" dot={false} strokeWidth={3} name="woman" />
                      <Line type="bump" dataKey="combined_pct" stroke="#264653" dot={false} strokeWidth={3} name="combined" />
                    </LineChart>
                  </ResponsiveContainer>
                  <AnalysisText>
                    The curves here are based on broad war‑related words like <i>missile, army, and invasion</i>, and not on any specific 
                    conflict, which explains why the pattern is very irregular.  The irregularity certainly comes for the fact that the caption 
                    contest doesn't provide cartoons depicting wars every week. Still, whenever the combined <i>war</i> percentage spikes, a clear gap usually opens up 
                    between the gender lines, with male‑coded terms outpacing female‑coded ones, reinforcing the stereotype of war as a male‑dominated domain.
                    A spike of female‑coded terms in early 2022 however remains unexplained.
                  </AnalysisText>
                </ComicBox>
              )}
              {selectedEvent === 'trump' && (
                <ComicBox title={<h3 className="comic-title text-xs font-bold" style={{ color: '#457B9D' }}>Trump</h3>} className="mb-8">
                  <p className="text-xs font-mono mb-6 leading-relaxed opacity-80 border-b border-gray-200 pb-4">
                    Donald Trump's notoriety in the news rises and falls depending on how controversial and political he is at a given moment. 
                    This timeline tracks how often Trump-related words appear in captions over time, and whether that correlates with changes 
                    in the gender distribution.
                  </p>
                  <ResponsiveContainer width="100%" height={350}>
                    <LineChart data={trump_timeline} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                      <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 5 }} label={{ value: 'caption percentage [%]', angle: -90 }} />
                      <Tooltip contentStyle={{ border: '2px solid #1A1A1A' }} formatter={(value: any, name: any, item: any) => [`${value}%`, name]} />
                      <Line type="bump" dataKey="ma_pct_man" stroke="#E63946" dot={false} strokeWidth={3} name="man" />
                      <Line type="bump" dataKey="ma_pct_woman" stroke="#2A9D8F" dot={false} strokeWidth={3} name="woman" />
                      <Line type="bump" dataKey="combined_pct" stroke="#264653" dot={false} strokeWidth={3} name="combined" />
                    </LineChart>
                  </ResponsiveContainer>
                  <AnalysisText>
                  <p className="text-xs font-mono mb-6 leading-relaxed opacity-80 border-b border-gray-200 pb-4">
                    What is striking here is that the gender split barely moves. Over time, men and 
                    women word groups stay surprisingly close to each other compared with other topics, 
                    without a clear long‑term drift in one direction. This is even 
                    more interesting when we consider that Trump’s public image is often highly gendered, 
                    with frequent references to masculinity, power, and dominance. One might expect that 
                    captions about Trump would skew more heavily toward male‑coded terms, but that does not 
                    seem to be the case here. 
                  </p>
                  <p className="text-xs font-mono mb-6 leading-relaxed opacity-80 border-b border-gray-200 pb-4">
                    Moreover, this topic was the only one where the overall share
                    of female‑coded terms were far from matching male‑coded ones.
                    But this more balanced look might partly be an artefact of scale: Trump‑related 
                    captions are so numerous compared to the other topics that small differences 
                    are smoothed out when expressed as percentages, making the gender gap appear narrower 
                    than in topics with fewer total captions.
                  </p>
                  </AnalysisText>

                    <ComicBox>
                    <p className="text-xs font-mono mb-6 leading-relaxed opacity-80 border-b border-gray-200 pb-4">
                      Here, it is also interesting to compare the previous results with the <strong>timeline of trump mentions</strong>.
                    </p>
                    <ResponsiveContainer width="100%" height={350}>
                      <LineChart data={df_vc.section1} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                        <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                        <YAxis tick={{ fontSize: 10 }} label={{ value: 'mentions', angle: -90, position: 'insideLeft' }} />
                        <Tooltip contentStyle={{ border: '2px solid #1A1A1A' }} />
                        <Line type="monotone" dataKey="trump" stroke="#457B9D" dot={false} strokeWidth={3} />
                      </LineChart>
                    </ResponsiveContainer>
                    <AnalysisText>
                      The figure shows that Trump is mentioned frequently over time, and the frequency fluctuates by following a pattern. 
                      A massive surge in mentions is visible from 2016 to 2018 with a peak in early 2017, corresponding to <strong>Trump's 
                        presidential campaign</strong> and early presidency. Media and public attention were <strong>extremely high</strong> during 
                        this time. Then, after mid-2017, the mentions' frequency shows a downward trend. This likely reflects a normalization effect, 
                        where Trump remained relevant, but no longer dominated headlines as much as during the election and early administration. 
                        Around 2019-2020, moderate peaks appear, which are possibly tied to the 2020 election and a <strong>major political event</strong>. 
                        Following his departure from office, the mentions drop, even if he still appears occasionally. Finally, Trump's mentions increase 
                        again mid-2023, where Trump <strong>announced his run for presidency</strong> again.
                  </AnalysisText>
                  </ComicBox>
                </ComicBox>
              )}

            </section>
          )}
          {/*Humor Chart*/}
          {selectedView === 'gapRate' && (
            <section>
              Humour is not just about who appears in a caption, but also about how the joke is told. 
              Our main question is now: is there a difference in humour or sentiment, 
              when it comes to gender?
              <ComicBox title="Humor Lables by Gender">
                <p className="text-xs font-mono mb-4 leading-relaxed opacity-80">
                  In this section, each caption is tagged with a <strong>humour label</strong> by an LLM, 
                  and those labels are then separated by gender‑related word groups to see whether men and 
                  women are laughed about in the same way. 
                </p>
                <div style={{ position: 'relative', paddingBottom: 56, display: 'flex', gap: '1rem', flexWrap: 'nowrap', alignItems: 'flex-start', overflowX: 'auto' }}>
                  {/* Men Pie */}
                  <div style={{ minWidth: 260, flex: '0 0 50%' }} className="text-center">
                    <h4 className="comic-title text-sm mb-2">Men</h4>
                    <ResponsiveContainer width="100%" height={220}>
                      <PieChart>
                        <Pie
                          data={humorMen}
                          dataKey="value"
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          innerRadius={40}
                          label={false}
                          labelLine={false}
                        >
                          {humorMen.map((entry: any, index: number) => (
                            <Cell key={`cell-hm-${index}`} fill={entry.color} stroke="#1A1A1A" strokeWidth={2} />
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

                  {/* Women Pie */}
                  <div style={{ minWidth: 260, flex: '0 0 50%' }} className="text-center">
                    <h4 className="comic-title text-sm mb-2">Women</h4>
                    <ResponsiveContainer width="100%" height={220}>
                      <PieChart>
                        <Pie
                          data={humorWomen}
                          dataKey="value"
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          innerRadius={40}
                          label={false}
                          labelLine={false}
                        >
                          {humorWomen.map((entry: any, index: number) => (
                            <Cell key={`cell-hw-${index}`} fill={entry.color} stroke="#1A1A1A" strokeWidth={2} />
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

                  <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', bottom: 6 }} className="flex flex-wrap justify-center gap-4 text-xs font-mono">
                    {humorMen.map((c: any, i: number) => (
                      <div key={`legend-h-${c.name}`} className="flex items-center gap-2">
                        <span style={{ width: 12, height: 12, background: c.color, display: 'inline-block', border: '2px solid #1A1A1A' }}></span>
                        <span>{c.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <AnalysisText>
                  At first glance, the two donut charts seem to tell slightly different stories about how men and 
                  women are joked about. Captions linked to women word groups appear to lean more toward 
                  <strong>incongruity‑absurdity</strong> and, to a lesser extent, sarcasm, while other humour types look broadly 
                  similar across genders. The statistical test confirms that impression only partially: there is 
                  a significant difference for <strong>sarcasm</strong> and for <strong>incongruity‑absurdity</strong>, but the proportions of the 
                  other humour labels do not differ in a meaningful way. In practice, this means that most joke 
                  styles are shared between men‑ and women‑related captions, with only these two categories 
                  showing a reliably gendered tilt.
                </AnalysisText>
              </ComicBox>
              <ComicBox title="Sentiment by Gender">
                <p className="text-xs font-mono mb-4 leading-relaxed opacity-80">
                  Humour in a caption is also shaped by its overall sentiment. In other words, the style of joke can 
                  vary depending on whether the caption is framed in a positive, neutral, or negative way.
                </p>
                <div style={{ position: 'relative', paddingBottom: 56, display: 'flex', gap: '1rem', flexWrap: 'nowrap', alignItems: 'flex-start', overflowX: 'auto' }}>
                  {/* Men Pie */}
                  <div style={{ minWidth: 260, flex: '0 0 50%' }} className="text-center">
                    <h4 className="comic-title text-sm mb-2">Men</h4>
                    <ResponsiveContainer width="100%" height={220}>
                      <PieChart>
                        <Pie
                          data={sentimentMen}
                          dataKey="value"
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          innerRadius={40}
                          label={false}
                          labelLine={false}
                        >
                          {sentimentMen.map((entry: any, index: number) => (
                            <Cell key={`cell-sm-${index}`} fill={entry.color} stroke="#1A1A1A" strokeWidth={2} />
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

                  {/* Women Pie */}
                  <div style={{ minWidth: 260, flex: '0 0 50%' }} className="text-center">
                    <h4 className="comic-title text-sm mb-2">Women</h4>
                    <ResponsiveContainer width="100%" height={220}>
                      <PieChart>
                        <Pie
                          data={sentimentWomen}
                          dataKey="value"
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          innerRadius={40}
                          label={false}
                          labelLine={false}
                        >
                          {sentimentWomen.map((entry: any, index: number) => (
                            <Cell key={`cell-sw-${index}`} fill={entry.color} stroke="#1A1A1A" strokeWidth={2} />
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

                  <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', bottom: 6 }} className="flex flex-wrap justify-center gap-4 text-xs font-mono">
                    {sentimentMen.map((c: any, i: number) => (
                      <div key={`legend-s-${c.name}`} className="flex items-center gap-2">
                        <span style={{ width: 12, height: 12, background: c.color, display: 'inline-block', border: '2px solid #1A1A1A' }}></span>
                        <span>{c.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <AnalysisText>
                  For sentiment, the visual contrast between the donuts is more suggestive than conclusive. We could 
                  read them as women‑related captions being slightly more neutral and men‑related captions 
                  carrying a bit more negative or positive charge. However, once sentiment is tested formally, 
                  these differences turn out not to be statistically significant. The distributions of negative, 
                  neutral, and positive captions across the two gender word groups are close enough that they 
                  could easily arise by chance. So, while the humour labels show a small but real divergence for 
                  sarcasm and incongruity, the overall emotional tone of the captions appears essentially similar 
                  for men and women.
                </AnalysisText>

                
              </ComicBox>              
              <ComicBox title="Google Trends Focus Groups Over Time">
                <p className="text-xs font-mono mb-6 leading-relaxed opacity-80 border-b border-gray-200 pb-4">
                  <strong>It is also interesting to compare the gender based analysis on the Google Trends: 
                  </strong>The following plots compare language used in our caption dataset with public attention measured by Google Trends. 
                  First, we aggregate unigram counts across multiple caption-derived CSV files (descriptions, locations, uncanny 
                  descriptions, and questions) to estimate how often each token appears in the dataset. We then align these tokens with 
                  Google Trends data (2016–2023, US) to study both overall popularity and temporal dynamics.
                </p>
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart data={trends_focusgroup} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} label={{ value: 'interest (0-100)', angle: -90, position: 'insideLeft' }} />
                    <Tooltip contentStyle={{ border: '2px solid #1A1A1A' }} />
                    <Line type="monotone" dataKey="women" stroke="#2A9D8F" dot={false} strokeWidth={3} />
                    <Line type="monotone" dataKey="men" stroke="#E63946" dot={false} strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
                <AnalysisText>
                  This graph shows the Google Trends time series for selected “focus group” tokens (here: men and women). 
                  It visualizes how public interest in these terms evolves over time and provides a direct comparison of their relative 
                  attention across months.
                </AnalysisText>
              </ComicBox>
              <ComicBox title="Google Trends Focus Groups Z-Score Over Time">

                <ResponsiveContainer width="100%" height={350}>
                  <LineChart data={trends_zscore} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} label={{ value: 'z-score', angle: -90, position: 'insideLeft' }} />
                    <Tooltip contentStyle={{ border: '2px solid #1A1A1A' }} />
                    <Line type="monotone" dataKey="women" stroke="#2A9D8F" dot={false} strokeWidth={3} />
                    <Line type="monotone" dataKey="men" stroke="#E63946" dot={false} strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
                <AnalysisText>
                  This graph compares the shape of the two focus-group Trends time series after z-scoring each one independently 
                  (so we compare deviations from each term's own baseline). This highlights whether the two terms rise and fall together 
                  over time, reported via Pearson and Kendall tau correlations.
                </AnalysisText>
              </ComicBox>
            </section>
          )}
        </motion.div>
      </div>

      {/* CONCLUSION SECTION */}
      <section className="mt-12">
        <SectionHeader 
          title="Conclusion" 
          subtitle="What the data tells us about gender representation in caption contest humor"
        />
        
        <ComicBox className="mb-6">
          <AnalysisText>
            <p className="mb-4">
              Across the caption corpus, the gender picture is one of quiet but persistent imbalance. 
              <strong> Male‑coded word groups are mentioned far more often than female‑coded ones </strong>, and this gap 
              barely shrinks when the data are unfolded over time or split by topic (covid, war, Trump, climate). 
              Occasional moments where women “win” a contest or a topic looks more balanced are rare and short‑lived 
              compared with the long baseline where men dominate the foreground.
            </p>
            
            <p className="mb-4">
              Event‑driven spikes mostly scale the volume without changing who is centered: when the pandemic hits, 
              wars flare up, or Trump dominates the news, the number of gendered mentions rises and falls, but the 
              relative advantage of male‑coded language stays remarkably stable. Even when compared with external 
              signals like Google search interest, the caption data keep telling the same story: attention moves, 
              the imbalance remains.
            </p>
            
            <p className="mb-4">
              Humour and sentiment add nuance rather than overturning this pattern. Most humour labels and all sentiment 
              categories are distributed similarly between men‑ and women‑related captions, but there is a statistically 
              significant shift for sarcasm and incongruity‑absurdity, which appear slightly more often in captions 
              involving women. By contrast, the overall emotional tone (how positive, negative, or neutral the captions 
              are) does not differ enough by gender to be statistically robust.
            </p>
            
            <p className="mb-4">
              Put together, the findings suggest that the New Yorker Caption Contest is not primarily a site of overtly 
              harsher treatment of women, but of uneven visibility. Men are more often named, cast as the default “someone” 
              in a joke, and keep that narrative centrality across years and news cycles. The inequality here is less about 
              explicit negativity and more about who gets to appear, be labelled, and carry the joke.
            </p>
          </AnalysisText>
        </ComicBox>
      </section>
    </div>
  );
} 
