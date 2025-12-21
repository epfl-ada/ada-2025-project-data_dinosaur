import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Database, Cpu, TrendingUp, Users, Zap } from 'lucide-react';

export function MethodologyInfographic() {
  const pipelines = [
    {
      title: 'Gender Detection',
      color: '#8D5B4C',
      icon: Users,
      steps: [
        { text: 'Author Names', icon: '👤' },
        { text: 'Name Database', icon: '📚' },
        { text: 'LLM Confirm', icon: '✓' },
        { text: 'Assignment', icon: '👥' }
      ]
    },
    {
      title: 'LLM Classification',
      color: '#E63946',
      icon: Zap,
      steps: [
        { text: 'Captions', icon: '💬' },
        { text: 'GPT-4 Analysis', icon: '🤖' },
        { text: 'Semantic Labels', icon: '🏷️' },
        { text: 'Refinement', icon: '✨' }
      ]
    },
    {
      title: 'Google Trends API',
      color: '#2A9D8F',
      icon: TrendingUp,
      steps: [
        { text: 'Event Keywords', icon: '🔑' },
        { text: 'API Query', icon: '🌐' },
        { text: 'Interest Data', icon: '📈' },
        { text: 'Correlation', icon: '🔗' }
      ]
    },
    {
      title: 'K-means Clustering',
      color: '#F4A261',
      icon: Cpu,
      steps: [
        { text: 'TF-IDF Vectors', icon: '🔢' },
        { text: 'K-means (k=5)', icon: '🎯' },
        { text: 'Cluster Assignment', icon: '🏷️' },
        { text: '5 Humor Types', icon: '🎭' }
      ]
    },
    {
      title: 'TF-IDF Vectorization',
      color: '#457B9D',
      icon: Database,
      steps: [
        { text: 'Raw Captions', icon: '📝' },
        { text: 'Text Cleaning', icon: '🧹' },
        { text: 'Tokenization', icon: '✂️' },
        { text: 'TF-IDF Matrix', icon: '📊' }
      ]
    }
  ];

  return (
    <div className="space-y-4">
      <div className="text-center mb-4">
        <div className="inline-block px-4 py-2 bg-[#2A9D8F] border-3 border-[#1A1A1A]" style={{ boxShadow: '3px 3px 0 #1A1A1A' }}>
          <h2 className="comic-title text-sm text-[#FDFDF8]">How the Analysis Was Done</h2>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {pipelines.map((pipeline, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="border-3 border-[#1A1A1A] bg-white p-4"
            style={{ boxShadow: '4px 4px 0 #1A1A1A' }}
          >
            {/* Header */}
            <div
              className="flex items-center gap-2 mb-3 p-2 border-2 border-[#1A1A1A]"
              style={{ backgroundColor: `${pipeline.color}20` }}
            >
              <pipeline.icon size={16} style={{ color: pipeline.color }} />
              <h3 className="comic-title text-xs" style={{ color: pipeline.color }}>
                {pipeline.title}
              </h3>
            </div>

            {/* Pipeline Steps */}
            <div className="space-y-2">
              {pipeline.steps.map((step, stepIndex) => (
                <div key={stepIndex}>
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 + stepIndex * 0.05 }}
                    className="flex items-center gap-2 p-2 bg-[#FDFDF8] border border-[#1A1A1A] rounded"
                  >
                    <span className="text-lg">{step.icon}</span>
                    <span className="comic-text text-[10px] flex-1">{step.text}</span>
                  </motion.div>
                  {stepIndex < pipeline.steps.length - 1 && (
                    <div className="flex justify-center my-1">
                      <ArrowRight size={12} style={{ color: pipeline.color }} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Additional methodology notes */}
      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className="border-3 border-[#1A1A1A] bg-[#FFF9E6] p-3" style={{ boxShadow: '3px 3px 0 #1A1A1A' }}>
          <h4 className="comic-title text-xs text-[#457B9D] mb-2">Key Algorithms</h4>
          <ul className="comic-text text-[10px] space-y-1">
            <li>• Scikit-learn K-means (n_clusters=5)</li>
            <li>• TF-IDF with max_features=1000</li>
            <li>• Elbow method for optimal k</li>
            <li>• Silhouette score validation</li>
          </ul>
        </div>

        <div className="border-3 border-[#1A1A1A] bg-[#FFF9E6] p-3" style={{ boxShadow: '3px 3px 0 #1A1A1A' }}>
          <h4 className="comic-title text-xs text-[#E63946] mb-2">Data Processing</h4>
          <ul className="comic-text text-[10px] space-y-1">
            <li>• Stop words removal (NLTK)</li>
            <li>• Lemmatization & stemming</li>
            <li>• Lowercase normalization</li>
            <li>• Special character handling</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
