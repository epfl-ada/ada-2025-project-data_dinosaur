import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

interface Cluster {
  id: string;
  name: string;
  color: string;
  size: number;
  x: number;
  y: number;
  description: string;
  keywords: string[];
  exampleThemes: string[];
  frequency: number;
}

export function Clusters() {
  const [selectedCluster, setSelectedCluster] = useState<Cluster | null>(null);

  const clusters: Cluster[] = [
    {
      id: '1',
      name: 'Political Satire',
      color: '#457B9D',
      size: 200,
      x: 30,
      y: 40,
      description: 'Sharp commentary on political events, elections, and governance. This cluster shows peaks during election cycles and major political upheavals.',
      keywords: ['election', 'vote', 'campaign', 'debate', 'policy', 'government', 'president', 'congress', 'senate', 'politics'],
      exampleThemes: [
        'Election Campaign Chaos',
        'Political Debates',
        'Congressional Gridlock',
        'Presidential Actions',
        'Voting Controversies',
        'Political Polarization'
      ],
      frequency: 23.4
    },
    {
      id: '2',
      name: 'Tech Anxiety',
      color: '#F4A261',
      size: 180,
      x: 70,
      y: 25,
      description: 'Humor exploring our complex relationship with technology, from smartphone addiction to AI fears. Rapidly growing cluster since 2020.',
      keywords: ['phone', 'AI', 'robot', 'social media', 'algorithm', 'tech', 'app', 'screen', 'online', 'digital'],
      exampleThemes: [
        'Smartphone Obsession',
        'Social Media Addiction',
        'AI Takes Over',
        'Algorithm Confusion',
        'Tech Support Nightmares',
        'ChatGPT Everything'
      ],
      frequency: 19.8
    },
    {
      id: '3',
      name: 'Work-Life Absurdity',
      color: '#2A9D8F',
      size: 160,
      x: 50,
      y: 70,
      description: 'The absurdities of modern work culture, corporate jargon, and the eternal struggle for work-life balance. Surged during remote work transitions.',
      keywords: ['office', 'meeting', 'boss', 'email', 'remote', 'zoom', 'work', 'career', 'job', 'burnout'],
      exampleThemes: [
        'Endless Meetings',
        'Corporate Speak',
        'Zoom Fatigue',
        'Return to Office Drama',
        'Email Overload',
        'Work-From-Home Life'
      ],
      frequency: 17.6
    },
    {
      id: '4',
      name: 'Pandemic Life',
      color: '#E63946',
      size: 220,
      x: 25,
      y: 30,
      description: 'The defining cluster of 2020-2021. Masks, distancing, lockdowns, and the surreal new normal. Highest concentration of captions in database.',
      keywords: ['mask', 'covid', 'quarantine', 'lockdown', 'distance', 'pandemic', 'zoom', 'vaccine', 'home', 'isolated'],
      exampleThemes: [
        'Mask Mishaps',
        'Zoom Call Disasters',
        'Sourdough Obsession',
        'Quarantine Routines',
        'Social Distancing',
        'Pandemic Parenting'
      ],
      frequency: 26.7
    },
    {
      id: '5',
      name: 'Climate Crisis',
      color: '#2A9D8F',
      size: 150,
      x: 65,
      y: 65,
      description: 'Environmental concerns, climate change, and ecological anxiety. Growing steadily throughout the period, with spikes during major climate events.',
      keywords: ['climate', 'earth', 'environment', 'green', 'carbon', 'sustainability', 'heat', 'weather', 'future', 'crisis'],
      exampleThemes: [
        'Extreme Weather',
        'Climate Denial',
        'Eco-Anxiety',
        'Record Heat',
        'Future Generations',
        'Environmental Activism'
      ],
      frequency: 12.5
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
          <h1 className="mb-4">Humor Clusters</h1>
          <p className="text-lg max-w-2xl mx-auto">
            Machine learning identified five distinct humor types across 587 cartoons. 
            Explore each cluster to understand its characteristics and evolution.
          </p>
        </motion.div>

        {/* Force-Directed Network Visualization */}
        <div className="relative bg-white rounded-2xl shadow-xl p-12 mb-16 border border-[#1A1A1A]/10">
          <div className="relative h-[600px]">
            {/* Connection Lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {clusters.map((cluster, i) => 
                clusters.slice(i + 1).map((other, j) => (
                  <motion.line
                    key={`${i}-${j}`}
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.1 }}
                    transition={{ delay: i * 0.1, duration: 0.5 }}
                    x1={`${cluster.x}%`}
                    y1={`${cluster.y}%`}
                    x2={`${other.x}%`}
                    y2={`${other.y}%`}
                    stroke="#1A1A1A"
                    strokeWidth="1"
                  />
                ))
              )}
            </svg>

            {/* Cluster Bubbles */}
            {clusters.map((cluster, index) => (
              <motion.button
                key={cluster.id}
                className="absolute rounded-full flex items-center justify-center cursor-pointer group shadow-lg hover:shadow-2xl transition-shadow"
                style={{
                  left: `${cluster.x}%`,
                  top: `${cluster.y}%`,
                  width: cluster.size,
                  height: cluster.size,
                  backgroundColor: cluster.color,
                  transform: 'translate(-50%, -50%)',
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 0.9 }}
                transition={{ delay: index * 0.1, type: 'spring', stiffness: 200 }}
                whileHover={{ scale: 1.1, opacity: 1 }}
                onClick={() => setSelectedCluster(cluster)}
              >
                <div className="text-center text-[#FDFDF8] p-4">
                  <div className="mb-2">{cluster.frequency}%</div>
                  <p className="text-sm leading-tight">{cluster.name}</p>
                </div>

                {/* Hover Ring */}
                <div 
                  className="absolute inset-0 rounded-full border-4 border-[#FDFDF8] opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ transform: 'scale(1.1)' }}
                />
              </motion.button>
            ))}
          </div>

          {/* Legend */}
          <div className="mt-8 pt-8 border-t border-[#1A1A1A]/10">
            <p className="text-sm text-[#1A1A1A]/60 text-center">
              Bubble size represents caption frequency | Click any cluster to explore details
            </p>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid md:grid-cols-5 gap-6">
          {clusters.map((cluster, index) => (
            <motion.button
              key={cluster.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              onClick={() => setSelectedCluster(cluster)}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all hover:scale-105 border border-[#1A1A1A]/5 text-left"
            >
              <div
                className="w-12 h-12 rounded-full mb-4 flex items-center justify-center text-[#FDFDF8]"
                style={{ backgroundColor: cluster.color }}
              >
                {cluster.frequency}%
              </div>
              <h4 className="mb-2">{cluster.name}</h4>
              <p className="text-sm text-[#1A1A1A]/60 line-clamp-3">
                {cluster.description}
              </p>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Cluster Detail Panel */}
      <AnimatePresence>
        {selectedCluster && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#1A1A1A]/80 backdrop-blur-sm flex items-center justify-center p-8"
            onClick={() => setSelectedCluster(null)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="absolute right-0 top-0 bottom-0 bg-[#FDFDF8] shadow-2xl max-w-xl w-full overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-[#FDFDF8] border-b border-[#1A1A1A]/10 p-6 flex items-center justify-between z-10">
                <div className="flex items-center gap-4">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center text-[#FDFDF8]"
                    style={{ backgroundColor: selectedCluster.color }}
                  >
                    <span>{selectedCluster.frequency}%</span>
                  </div>
                  <div>
                    <h2>{selectedCluster.name}</h2>
                    <p className="text-sm text-[#1A1A1A]/60">
                      {Math.round((selectedCluster.frequency / 100) * 587)} captions
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedCluster(null)}
                  className="w-10 h-10 bg-[#E63946] text-[#FDFDF8] rounded-full flex items-center justify-center hover:bg-[#d32f3d] transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 space-y-8">
                {/* Description */}
                <div>
                  <h3 className="mb-3">About This Cluster</h3>
                  <p className="text-[#1A1A1A]/70">{selectedCluster.description}</p>
                </div>

                {/* Top Keywords */}
                <div>
                  <h3 className="mb-3">Top 10 Keywords</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedCluster.keywords.map((keyword, index) => (
                      <motion.span
                        key={index}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className="px-4 py-2 bg-white rounded-full text-sm border border-[#1A1A1A]/20 hover:border-[#E63946] transition-colors"
                      >
                        {keyword}
                      </motion.span>
                    ))}
                  </div>
                </div>

                {/* Example Themes */}
                <div>
                  <h3 className="mb-3">Example Cartoon Themes</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {selectedCluster.exampleThemes.map((theme, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + index * 0.05 }}
                        className="bg-white p-4 rounded-lg border border-[#1A1A1A]/10 hover:shadow-md transition-shadow"
                      >
                        <div className="text-4xl mb-2">🎨</div>
                        <p className="text-sm font-serif italic" style={{ fontFamily: "'Reenie Beanie', cursive", fontSize: '16px' }}>
                          {theme}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Show on Timeline Button */}
                <button
                  className="w-full bg-[#E63946] text-[#FDFDF8] py-4 rounded-lg hover:bg-[#d32f3d] transition-colors"
                >
                  Show on Timeline
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
