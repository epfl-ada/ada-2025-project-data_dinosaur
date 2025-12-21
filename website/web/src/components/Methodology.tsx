import React from 'react';
import { motion } from 'motion/react';
import { Database, Brain, TrendingUp, BarChart3 } from 'lucide-react';
import { Starburst, SpeechBubble, ComicPanel, SoundEffect } from './ComicElements';

export function Methodology() {
  const methods = [
    {
      icon: Database,
      title: 'Data Collection',
      color: '#457B9D',
      description: 'Scraped 587 winning captions from The New Yorker Cartoon Caption Contest database spanning 2016-2023. Each caption was tagged with date, cartoon ID, and contextual metadata.',
      details: [
        'Source: The New Yorker official contest archive',
        'Time period: January 2016 - December 2023',
        'Total captions: 587 winning entries',
        'Metadata: Date, cartoon ID, contest number'
      ]
    },
    {
      icon: Brain,
      title: 'Machine Learning Clustering',
      color: '#F4A261',
      description: 'Applied k-means clustering algorithm with TF-IDF vectorization to identify distinct humor types. Optimal cluster number (k=5) determined via elbow method.',
      details: [
        'Algorithm: K-means clustering',
        'Feature extraction: TF-IDF vectorization',
        'Preprocessing: Lemmatization, stopword removal',
        'Validation: Silhouette score analysis'
      ]
    },
    {
      icon: TrendingUp,
      title: 'Trend Analysis',
      color: '#2A9D8F',
      description: 'Cross-referenced caption keywords with Google Trends data to identify correlations between humor topics and real-world search interest patterns.',
      details: [
        'Source: Google Trends API',
        'Metrics: Relative search interest (0-100)',
        'Time resolution: Monthly aggregates',
        'Geographic scope: United States'
      ]
    },
    {
      icon: BarChart3,
      title: 'Statistical Analysis',
      color: '#E63946',
      description: 'Performed temporal pattern analysis, word frequency distribution, and correlation studies to track humor evolution alongside major world events.',
      details: [
        'Word frequency analysis',
        'Temporal distribution mapping',
        'Event correlation studies',
        'Cluster evolution tracking'
      ]
    }
  ];

  return (
    <div className="min-h-screen pt-32 pb-24 px-8">
      <div className="max-w-[1440px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-block mb-6">
            <Starburst color="#457B9D" size={180}>
              Methods
            </Starburst>
          </div>
          <SpeechBubble color="white" className="max-w-2xl mx-auto">
            <p className="text-lg comic-text">
              Our research combines natural language processing, machine learning, 
              and data visualization to reveal patterns in humor evolution.
            </p>
          </SpeechBubble>
        </motion.div>

        {/* Method Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {methods.map((method, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <ComicPanel className="p-8 h-full hover:scale-105 transition-transform">
                <div className="flex items-start gap-4 mb-6">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0 border-4 border-[#1A1A1A]"
                    style={{ 
                      backgroundColor: method.color,
                      boxShadow: '4px 4px 0 #1A1A1A'
                    }}
                  >
                    <method.icon size={28} className="text-[#FDFDF8]" />
                  </div>
                  <div>
                    <h3 className="comic-title mb-2" style={{ color: method.color }}>{method.title}</h3>
                    <div
                      className="w-12 h-2 border-2 border-[#1A1A1A]"
                      style={{ backgroundColor: method.color }}
                    />
                  </div>
                </div>
                <p className="mb-6 comic-text">{method.description}</p>
                <ul className="space-y-2">
                  {method.details.map((detail, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <div
                        className="w-2 h-2 border-2 border-[#1A1A1A] mt-2 flex-shrink-0 transform rotate-45"
                        style={{ backgroundColor: method.color }}
                      />
                      <span className="comic-text text-sm">{detail}</span>
                    </li>
                  ))}
                </ul>
              </ComicPanel>
            </motion.div>
          ))}
        </div>

        {/* Technical Details */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="text-center mb-8">
            <SoundEffect text="Tech Stack!" color="#F4A261" className="text-4xl" />
          </div>
          <ComicPanel className="p-12">
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <div className="inline-block mb-4 px-4 py-2 bg-[#457B9D] border-3 border-[#1A1A1A] transform -rotate-2">
                  <h4 className="comic-title text-[#FDFDF8]">Data Processing</h4>
                </div>
                <ul className="space-y-2 text-sm comic-text">
                  <li>• Python 3.9+</li>
                  <li>• Pandas & NumPy</li>
                  <li>• NLTK for NLP</li>
                  <li>• Scikit-learn</li>
                </ul>
              </div>
              <div>
                <div className="inline-block mb-4 px-4 py-2 bg-[#F4A261] border-3 border-[#1A1A1A] transform rotate-1">
                  <h4 className="comic-title text-[#FDFDF8]">Visualization</h4>
                </div>
                <ul className="space-y-2 text-sm comic-text">
                  <li>• React & TypeScript</li>
                  <li>• Recharts library</li>
                  <li>• Motion animations</li>
                  <li>• Tailwind CSS</li>
                </ul>
              </div>
              <div>
                <div className="inline-block mb-4 px-4 py-2 bg-[#2A9D8F] border-3 border-[#1A1A1A] transform -rotate-1">
                  <h4 className="comic-title text-[#FDFDF8]">Data Sources</h4>
                </div>
                <ul className="space-y-2 text-sm comic-text">
                  <li>• The New Yorker API</li>
                  <li>• Google Trends API</li>
                  <li>• Historical event databases</li>
                  <li>• Manual context curation</li>
                </ul>
              </div>
            </div>
          </ComicPanel>
        </motion.div>

        {/* Research Notes */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8"
        >
          <SpeechBubble color="#FDFDF8" position="left" className="max-w-4xl">
            <h3 className="comic-title text-lg mb-4 text-[#E63946]">Research Limitations</h3>
            <p className="comic-text mb-4">
              This analysis focuses solely on winning captions from The New Yorker contest, 
              which may not represent the full spectrum of submitted humor. The clustering 
              algorithm identified optimal patterns within the dataset, but human interpretation 
              of humor remains subjective.
            </p>
            <p className="comic-text">
              Google Trends data provides relative search interest, not absolute numbers, 
              and correlations should not be interpreted as causations. Context curation 
              for world events was performed manually and may reflect researcher bias.
            </p>
          </SpeechBubble>
        </motion.div>
      </div>
    </div>
  );
}