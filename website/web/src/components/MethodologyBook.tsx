import React from 'react';
import { motion } from 'motion/react';
import { Database, Brain, TrendingUp, BarChart3 } from 'lucide-react';
import { Starburst } from './ComicElements';

export function MethodologyBook() {
  const methods = [
    {
      icon: Database,
      title: 'Data Collection',
      color: '#457B9D',
      description: 'Scraped 587 winning captions from The New Yorker contest archive',
      points: ['2016-2023', '587 captions', 'Tagged metadata']
    },
    {
      icon: Brain,
      title: 'ML Clustering',
      color: '#F4A261',
      description: 'K-means clustering with TF-IDF to identify humor types',
      points: ['K-means algorithm', 'TF-IDF features', 'k=5 clusters']
    },
    {
      icon: TrendingUp,
      title: 'Trend Analysis',
      color: '#2A9D8F',
      description: 'Cross-referenced with Google Trends for correlation',
      points: ['Google Trends', 'Monthly data', 'US scope']
    },
    {
      icon: BarChart3,
      title: 'Statistics',
      color: '#E63946',
      description: 'Temporal patterns and word frequency analysis',
      points: ['Word frequency', 'Time mapping', 'Event correlation']
    }
  ];

  return (
    <div className="h-full flex flex-col">
      {/* Page Title */}
      <div className="text-center mb-6">
        <Starburst color="#457B9D" size={120}>
          Methods
        </Starburst>
      </div>

      <p className="text-center comic-text mb-6 max-w-2xl mx-auto text-sm">
        Combining NLP, machine learning, and data visualization
      </p>

      {/* Methods Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {methods.map((method, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="border-4 border-[#1A1A1A] p-4 bg-white relative overflow-hidden"
            style={{ boxShadow: '4px 4px 0 #1A1A1A' }}
          >
            <div 
              className="absolute inset-0 opacity-5"
              style={{ backgroundColor: method.color }}
            />

            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center border-3 border-[#1A1A1A]"
                  style={{ backgroundColor: method.color }}
                >
                  <method.icon size={18} className="text-[#FDFDF8]" />
                </div>
                <h3 className="comic-title text-sm" style={{ color: method.color }}>
                  {method.title}
                </h3>
              </div>

              <p className="comic-text text-xs mb-3 leading-snug">
                {method.description}
              </p>

              <ul className="space-y-1">
                {method.points.map((point, i) => (
                  <li key={i} className="flex items-center gap-1 text-[10px]">
                    <div
                      className="w-1.5 h-1.5 border border-[#1A1A1A] rounded-full"
                      style={{ backgroundColor: method.color }}
                    />
                    <span className="comic-text">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Tech Stack */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="border-4 border-[#1A1A1A] p-4 bg-white"
        style={{ boxShadow: '4px 4px 0 #1A1A1A' }}
      >
        <div className="inline-block mb-3 px-3 py-1 bg-[#F4A261] border-2 border-[#1A1A1A]">
          <h3 className="comic-title text-xs text-[#FDFDF8]">Technical Stack</h3>
        </div>

        <div className="grid grid-cols-3 gap-4 text-[10px]">
          <div>
            <p className="comic-title text-xs mb-2 text-[#457B9D]">Processing</p>
            <ul className="space-y-1 comic-text">
              <li>• Python 3.9+</li>
              <li>• Pandas/NumPy</li>
              <li>• NLTK</li>
              <li>• Scikit-learn</li>
            </ul>
          </div>
          <div>
            <p className="comic-title text-xs mb-2 text-[#F4A261]">Visualization</p>
            <ul className="space-y-1 comic-text">
              <li>• React/TS</li>
              <li>• Recharts</li>
              <li>• Motion</li>
              <li>• Tailwind</li>
            </ul>
          </div>
          <div>
            <p className="comic-title text-xs mb-2 text-[#2A9D8F]">Sources</p>
            <ul className="space-y-1 comic-text">
              <li>• New Yorker</li>
              <li>• Google Trends</li>
              <li>• Event DBs</li>
              <li>• Manual data</li>
            </ul>
          </div>
        </div>
      </motion.div>

      {/* Limitations Note */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-4 p-3 bg-[#FFF9E6] border-l-4 border-[#E63946]"
      >
        <p className="handwritten text-xs text-[#8B4513] leading-relaxed">
          Note: Analysis focuses on winning captions only. Correlations ≠ causation. 
          Manual curation may reflect researcher bias.
        </p>
      </motion.div>
    </div>
  );
}
