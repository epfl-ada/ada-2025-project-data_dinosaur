import React from 'react';
import { motion } from 'motion/react';
import { BookOpen, Database, Calendar, TrendingUp } from 'lucide-react';
import { Starburst } from './ComicElements';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useData } from '@/context/DataContext';

export function StoryPage() {
  const { selectCluster, selectTimeframe } = useData();
  const datasetStats = [
    { icon: '📅', label: 'Time Period', value: '2016-2023', color: '#E63946' },
    { icon: '📘', label: 'Winning Captions', value: '587', color: '#457B9D' },
    { icon: '🧪', label: 'Data Points', value: '12,000+', color: '#2A9D8F' },
    { icon: '🎭', label: 'Humor Clusters', value: '5', color: '#F4A261' },
  ];

  // Caption Volume Over Time data
  const captionVolumeData = [
    { year: '2016', count: 52 },
    { year: '2017', count: 48 },
    { year: '2018', count: 65 },
    { year: '2019', count: 72 },
    { year: '2020', count: 89 },
    { year: '2021', count: 78 },
    { year: '2022', count: 95 },
    { year: '2023', count: 88 },
  ];

  // Top token frequency data
  const tokenFrequencyData = [
    { word: 'home', count: 456 },
    { word: 'work', count: 423 },
    { word: 'like', count: 398 },
    { word: 'time', count: 367 },
    { word: 'just', count: 334 },
    { word: 'people', count: 312 },
  ];

  return (
    <div className="h-full flex flex-col overflow-y-auto">
      {/* Page Title */}
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', duration: 1 }}
        >
          <Starburst color="#457B9D" size={140}>
            The Story
          </Starburst>
        </motion.div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-2 gap-8 flex-1">
        {/* Left Column - Story */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <div className="border-4 border-[#1A1A1A] bg-white p-6 h-full" style={{ boxShadow: '6px 6px 0 #1A1A1A' }}>
            <div className="inline-block mb-4 px-4 py-2 bg-[#E63946] border-3 border-[#1A1A1A] transform -rotate-1">
              <h2 className="comic-title text-lg text-[#FDFDF8]">Our Journey</h2>
            </div>

            <div className="space-y-4 comic-text leading-relaxed">
              <p>
                <span className="handwritten text-xl text-[#E63946]">The New Yorker</span> Cartoon
                Caption Contest has been delighting readers since 2005, becoming a cultural
                touchstone that reflects our collective sense of humor.
              </p>

              <p>
                But humor doesn't exist in a vacuum—it <span className="comic-title text-[#457B9D]">
                  evolves with the times</span>, responding to <span className="comic-title text-[#E63946]">political upheaval</span>, <span className="comic-title text-[#F4A261]">technological change</span>,
                a <span className="comic-title text-[#E63946]">pandemic</span>, and the <span className="comic-title text-[#2A9D8F]">climate crisis</span>.
              </p>

              <p>
                This project explores <span className="comic-title text-[#2A9D8F]">how our humor
                  changed</span> from 2016 to 2023—through data, machine learning, and the lens of major world events. We discovered patterns that reveal how <span className="comic-title text-[#457B9D]">society processes trauma through laughter</span>.
              </p>

              <div className="mt-6 p-4 bg-[#FFF9E6] border-l-4 border-[#F4A261]">
                <p className="handwritten text-lg text-[#8B4513] italic">
                  "By analyzing 587 winning captions through machine learning, we uncovered
                  five distinct humor clusters and tracked how they shifted alongside world events."
                </p>
              </div>

              {/* Quick CTA to guide exploration */}
              <div className="mt-6 p-4 border-3 border-[#1A1A1A] bg-white">
                <p className="comic-title text-sm mb-2">Explore the data</p>
                <div className="flex gap-3">
                  <button
                    className="interactive-cta"
                    onClick={() => selectTimeframe(2020)}
                  >
                    Explore 2020
                  </button>

                  <button
                    className="interactive-cta"
                    onClick={() => selectCluster('Tech Anxiety')}
                  >
                    Focus: Tech
                  </button>

                  <button
                    className="interactive-cta"
                    onClick={() => selectCluster('Political Satire')}
                  >
                    Focus: Political
                  </button>
                </div>
                <p className="comic-text text-xs mt-2 opacity-70">Click a CTA to jump into visual analysis. These set filters for Timeline & Cluster views.</p>
              </div>
            </div>


            {/* Cartoons Section - Removed */}
          </div>
        </motion.div>

        {/* Right Column - Dataset Info */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="space-y-6"
        >
          {/* Dataset Stats */}
          <div className="border-4 border-[#1A1A1A] bg-white p-6" style={{ boxShadow: '6px 6px 0 #1A1A1A' }}>
            <div className="inline-block mb-4 px-4 py-2 bg-[#2A9D8F] border-3 border-[#1A1A1A] transform rotate-1">
              <h2 className="comic-title text-lg text-[#FDFDF8]">The Dataset</h2>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              {datasetStats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 + index * 0.1, type: 'spring' }}
                  className="border-3 border-[#1A1A1A] p-4 bg-[#FDFDF8] relative overflow-hidden"
                  style={{ boxShadow: '3px 3px 0 #1A1A1A' }}
                >
                  <div
                    className="absolute inset-0 opacity-10"
                    style={{ backgroundColor: stat.color }}
                  />
                  <div className="relative z-10">
                    <div className="text-3xl mb-2">{stat.icon}</div>
                    <div className="comic-title text-2xl mb-1" style={{ color: stat.color }}>
                      {stat.value}
                    </div>
                    <p className="comic-text text-xs">{stat.label}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Caption Volume Over Time Chart */}
            <div className="mt-4 p-3 bg-[#FDFDF8] border-2 border-[#1A1A1A]">
              <p className="comic-title text-xs mb-2 text-[#457B9D]">Caption Volume Over Time</p>
              <div style={{ width: '100%', height: 120 }}>
                <ResponsiveContainer>
                  <LineChart data={captionVolumeData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1A1A1A" opacity={0.1} />
                    <XAxis
                      dataKey="year"
                      tick={{ fontSize: 9, fill: '#1A1A1A' }}
                      stroke="#1A1A1A"
                    />
                    <YAxis
                      tick={{ fontSize: 9, fill: '#1A1A1A' }}
                      stroke="#1A1A1A"
                    />
                    <Tooltip
                      contentStyle={{
                        border: '2px solid #1A1A1A',
                        borderRadius: '4px',
                        fontSize: '10px'
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="count"
                      stroke="#457B9D"
                      strokeWidth={2}
                      dot={{ fill: '#457B9D', r: 3 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <p className="comic-text text-[9px] mt-1 opacity-70">
                Dataset size varies per year — reflects submission volume & editorial choices
              </p>
            </div>
          </div>

          {/* Token Frequency Preview */}
          <div className="border-4 border-[#1A1A1A] bg-white p-6" style={{ boxShadow: '6px 6px 0 #1A1A1A' }}>
            <div className="inline-block mb-4 px-4 py-2 bg-[#F4A261] border-3 border-[#1A1A1A]">
              <h2 className="comic-title text-sm text-[#FDFDF8]">Top Words</h2>
            </div>

            <div style={{ width: '100%', height: 140 }}>
              <ResponsiveContainer>
                <BarChart data={tokenFrequencyData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#1A1A1A" opacity={0.1} />
                  <XAxis type="number" tick={{ fontSize: 9, fill: '#1A1A1A' }} stroke="#1A1A1A" />
                  <YAxis
                    type="category"
                    dataKey="word"
                    tick={{ fontSize: 10, fill: '#1A1A1A' }}
                    stroke="#1A1A1A"
                    width={60}
                  />
                  <Tooltip
                    contentStyle={{
                      border: '2px solid #1A1A1A',
                      borderRadius: '4px',
                      fontSize: '10px'
                    }}
                  />
                  <Bar dataKey="count" fill="#F4A261" stroke="#1A1A1A" strokeWidth={2} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="comic-text text-[9px] mt-2 opacity-70">
              Most frequent words after text cleaning & preprocessing
            </p>
          </div>

          {/* Research Approach - Shortened */}
          <div className="border-4 border-[#1A1A1A] bg-white p-4" style={{ boxShadow: '6px 6px 0 #1A1A1A' }}>
            <div className="inline-block mb-3 px-3 py-1 bg-[#2A9D8F] border-2 border-[#1A1A1A]">
              <h2 className="comic-title text-xs text-[#FDFDF8]">Our Approach</h2>
            </div>

            <div className="space-y-2 comic-text text-xs">
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 border-2 border-[#1A1A1A] bg-[#E63946] transform rotate-45 mt-1 flex-shrink-0" />
                <p><span className="comic-title text-[#E63946]">ML:</span> K-means clustering with TF-IDF</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 border-2 border-[#1A1A1A] bg-[#457B9D] transform rotate-45 mt-1 flex-shrink-0" />
                <p><span className="comic-title text-[#457B9D]">Trends:</span> Google Trends correlation</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 border-2 border-[#1A1A1A] bg-[#2A9D8F] transform rotate-45 mt-1 flex-shrink-0" />
                <p><span className="comic-title text-[#2A9D8F]">Events:</span> World events mapping</p>
              </div>
            </div>
          </div>

          {/* Fun Fact */}
          <motion.div
            initial={{ opacity: 0, rotate: -5 }}
            animate={{ opacity: 1, rotate: 0 }}
            transition={{ delay: 1.2 }}
            className="border-4 border-[#1A1A1A] bg-[#FFF9E6] p-4 transform rotate-1"
            style={{ boxShadow: '4px 4px 0 #1A1A1A' }}
          >
            <div className="handwritten text-[#8B4513]">
              <p className="text-lg mb-2">💡 Fun Fact!</p>
              <p className="text-sm">
                The word "mask" appeared <span className="comic-title text-[#E63946]">456 times</span> in
                2020 captions—a 1,200% increase from 2019!
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}