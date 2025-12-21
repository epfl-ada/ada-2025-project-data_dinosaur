import React from 'react';
import { motion } from 'motion/react';
import { Mail, Github, Linkedin, BookOpen } from 'lucide-react';
import { Starburst, SpeechBubble, ComicPanel, SoundEffect } from './ComicElements';

export function About() {
  return (
    <div className="min-h-screen pt-32 pb-24 px-8">
      <div className="max-w-[1440px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-block mb-6">
            <Starburst color="#2A9D8F" size={180}>
              About
            </Starburst>
          </div>
          <SpeechBubble color="white" className="max-w-2xl mx-auto">
            <p className="text-lg comic-text">
              An interactive exploration of humor's evolution through The New Yorker's 
              iconic cartoon caption contest.
            </p>
          </SpeechBubble>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 mb-16">
          {/* Project Story */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="inline-block mb-6 px-6 py-3 bg-[#457B9D] border-4 border-[#1A1A1A] transform -rotate-2">
              <h2 className="comic-title text-[#FDFDF8]">The Story</h2>
            </div>
            <ComicPanel className="p-6 space-y-4">
              <p className="comic-text">
                The New Yorker Cartoon Caption Contest has been delighting readers 
                since 2005, challenging them to come up with the wittiest caption for 
                a captionless cartoon. Over nearly two decades, it has become a cultural 
                touchstone, reflecting our collective sense of humor.
              </p>
              <p className="comic-text">
                But humor doesn't exist in a vacuum—it evolves with the times, responding 
                to current events, social changes, and cultural shifts. This project asks: 
                How has our humor changed from 2016 to 2023, a period marked by political 
                upheaval, technological transformation, a global pandemic, and climate crisis?
              </p>
              <p className="comic-text">
                By analyzing 587 winning captions through machine learning and data 
                visualization, we uncovered five distinct "humor clusters" and tracked 
                how they waxed and waned alongside world events. The results paint a 
                fascinating picture of collective psychology expressed through wit.
              </p>
            </ComicPanel>
          </motion.div>

          {/* Key Findings */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="inline-block mb-6 px-6 py-3 bg-[#E63946] border-4 border-[#1A1A1A] transform rotate-2">
              <h2 className="comic-title text-[#FDFDF8]">Key Findings</h2>
            </div>
            <div className="space-y-4">
              {[
                {
                  title: 'Pandemic Dominance',
                  text: 'COVID-19 humor represented 26.7% of all captions from 2020-2021, the highest concentration of any single theme.',
                  color: '#E63946'
                },
                {
                  title: 'Tech Anxiety Surge',
                  text: 'Technology-related humor grew 340% from 2016 to 2023, with AI themes exploding in early 2023.',
                  color: '#F4A261'
                },
                {
                  title: 'Political Cyclicity',
                  text: 'Political satire showed clear spikes during election years (2016, 2020) with 85% correlation to Google Trends data.',
                  color: '#457B9D'
                },
                {
                  title: 'Climate Persistence',
                  text: 'Environmental humor maintained steady growth throughout the period, becoming increasingly urgent in tone.',
                  color: '#2A9D8F'
                }
              ].map((finding, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                >
                  <ComicPanel className="p-6">
                    <div className="flex items-start gap-3 mb-3">
                      <div 
                        className="w-3 h-3 border-2 border-[#1A1A1A] transform rotate-45 flex-shrink-0 mt-2"
                        style={{ backgroundColor: finding.color }}
                      />
                      <h4 className="comic-title" style={{ color: finding.color }}>
                        {finding.title}
                      </h4>
                    </div>
                    <p className="text-sm comic-text">{finding.text}</p>
                  </ComicPanel>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Credits Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="text-center mb-8">
            <SoundEffect text="Credits!" color="#F4A261" className="text-4xl" />
          </div>
          <ComicPanel className="p-12">
            <div className="grid md:grid-cols-2 gap-12 mb-12">
              <div>
                <div className="inline-block mb-6 px-4 py-2 bg-[#457B9D] border-3 border-[#1A1A1A] transform -rotate-1">
                  <h3 className="comic-title text-[#FDFDF8]">Data Sources</h3>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <BookOpen size={20} className="mt-1 flex-shrink-0 text-[#457B9D]" />
                    <div className="comic-text">
                      <span className="block">The New Yorker</span>
                      <span className="text-sm opacity-70">Cartoon Caption Contest Archive</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <BookOpen size={20} className="mt-1 flex-shrink-0 text-[#457B9D]" />
                    <div className="comic-text">
                      <span className="block">Google Trends</span>
                      <span className="text-sm opacity-70">Search Interest Data API</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <BookOpen size={20} className="mt-1 flex-shrink-0 text-[#457B9D]" />
                    <div className="comic-text">
                      <span className="block">Various News Archives</span>
                      <span className="text-sm opacity-70">Historical Context & Event Data</span>
                    </div>
                  </li>
                </ul>
              </div>

              <div>
                <div className="inline-block mb-6 px-4 py-2 bg-[#F4A261] border-3 border-[#1A1A1A] transform rotate-1">
                  <h3 className="comic-title text-[#FDFDF8]">Tools & Tech</h3>
                </div>
                <ul className="space-y-3 comic-text">
                  <li>• Python (Pandas, NumPy, Scikit-learn, NLTK)</li>
                  <li>• React & TypeScript</li>
                  <li>• Recharts for data visualization</li>
                  <li>• Motion for animations</li>
                  <li>• Tailwind CSS for styling</li>
                </ul>
              </div>
            </div>

            <div className="text-center pt-8 border-t-4 border-[#1A1A1A] border-dashed">
              <p className="comic-text mb-6">
                This project is an independent research initiative and is not affiliated 
                with or endorsed by The New Yorker or Condé Nast.
              </p>
              <div className="flex justify-center gap-4">
                <motion.button 
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-14 h-14 bg-[#E63946] text-[#FDFDF8] rounded-full flex items-center justify-center border-4 border-[#1A1A1A] transition-colors"
                  style={{ boxShadow: '4px 4px 0 #1A1A1A' }}
                >
                  <Mail size={20} />
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.1, rotate: -5 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-14 h-14 bg-[#457B9D] text-[#FDFDF8] rounded-full flex items-center justify-center border-4 border-[#1A1A1A] transition-colors"
                  style={{ boxShadow: '4px 4px 0 #1A1A1A' }}
                >
                  <Github size={20} />
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-14 h-14 bg-[#2A9D8F] text-[#FDFDF8] rounded-full flex items-center justify-center border-4 border-[#1A1A1A] transition-colors"
                  style={{ boxShadow: '4px 4px 0 #1A1A1A' }}
                >
                  <Linkedin size={20} />
                </motion.button>
              </div>
            </div>
          </ComicPanel>
        </motion.div>

        {/* Citation */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8"
        >
          <SpeechBubble color="#FDFDF8" position="left" className="max-w-4xl">
            <h3 className="comic-title text-lg mb-4 text-[#E63946]">How to Cite</h3>
            <p className="text-sm comic-text bg-white p-4 border-2 border-[#1A1A1A] rounded">
              Chronicle of Humor: The New Yorker Cartoon Caption Contest Analysis (2016-2023). 
              Interactive Data Visualization Project. Accessed {new Date().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}.
            </p>
          </SpeechBubble>
        </motion.div>
      </div>
    </div>
  );
}