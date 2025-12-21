import React from 'react';
import { motion } from 'motion/react';
import { Mail, Github, Linkedin, Heart, BookOpen, Database, Code, Brain, ChartBar, Users } from 'lucide-react';

export function CreditsPage() {
  const teamMembers = [
    "Thara Marie Hayat Belin",
    "Kamegne Yann Eddy Sipofo",
    "Silvia Camenzind",
    "Yuno Reigner",
    "Jannik Jordi"
  ];

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-6xl mx-auto py-8 px-6">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1
            className="comic-title mb-4"
            style={{
              fontSize: '3rem',
              textShadow: '3px 3px 0px #E63946, 6px 6px 0px #1A1A1A'
            }}
          >
            Credits & Thanks
          </h1>
        </motion.div>

        {/* Methodology Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="border-4 border-[#1A1A1A] bg-white p-6 mb-8" style={{ boxShadow: '5px 5px 0 #1A1A1A' }}>
            <div className="inline-block mb-4 px-4 py-2 bg-[#2A9D8F] border-3 border-[#1A1A1A]">
              <h2 className="comic-title text-sm text-[#FDFDF8]">Methodology & Analysis</h2>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <Database className="text-[#E63946]" size={20} />
                <h3 className="comic-title text-[#457B9D]">
                  Event-Centered Temporal Analysis
                </h3>
              </div>
              <p className="comic-text text-sm leading-relaxed mb-4">
                We designed an interactive, event-centered analysis framework that aligns caption language with public attention over time.
                For each major real-world event, we defined explicit event windows and compared caption frequencies with Google Trends
                using raw values, z-score normalization, and lagged correlations. This approach enables a direct interpretation of whether
                humor reacts to, anticipates, or evolves independently from public interest, and supports event-specific synthesis of findings.
              </p>
            </div>
            
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Users className="text-[#E63946]" size={20} />
                <h3 className="comic-title text-[#457B9D]">
                  Gender Representation Analysis
                </h3>
              </div>
              <p className="comic-text text-sm leading-relaxed mb-4">
                To quantify how often captions refer to men or women, we built a scalable keyword-detection pipeline over the entire corpus. 
                For each caption, we stream the text through a spaCy-based lemmatizer in mini-batches, normalize every token to its lowercase 
                lemma, and check for intersections with curated sets of male‑ and female‑coded terms.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Brain className="text-[#E63946]" size={20} />
                  <h3 className="comic-title text-[#457B9D]">NLP & Transformations</h3>
                </div>
                <p className="comic-text text-sm leading-relaxed mb-4">
                  We leveraged advanced NLP to analyze captions. Our pipeline combines <strong>RoBERTa</strong> for sentiment analysis,
                  <strong>Llama 3</strong> for detecting complex humor patterns (e.g., Irony, Satire), and a <strong>SentenceTransformer</strong>
                  embedding model to cluster tokens into thematic humor types. We compared word frequencies with <strong>Google Trends</strong>,
                  analyzing lexical shifts (e.g., "Negative" vs "Pandemic" words) over time to see how real-world events influenced the contest.
                </p>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <ChartBar className="text-[#E63946]" size={20} />
                  <h3 className="comic-title text-[#457B9D]">Visual & Statistical Analysis</h3>
                </div>
                <p className="comic-text text-sm leading-relaxed mb-4">
                  We performed a deep-dive into image descriptions and entities to understand what makes a cartoon funny.
                  We applied a <strong>Bechdel-like test</strong>, discovering a 3.5:1 ratio of men-to-women mentions
                  and analyzing how gendered terms correlate with user votes. Finally, we visualized the evolution of
                  humor types across weeks to detect seasonal or event-driven patterns in comedy.These analyses are presented 
                  through an interactive journal-style interface that combines synchronized plots,
                  event highlighting, and inline explanations to guide interpretation across temporal and semantic scales.

                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Credits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Authors */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="border-4 border-[#1A1A1A] bg-white p-6"
            style={{ boxShadow: '5px 5px 0 #1A1A1A' }}
          >
            <div className="inline-block mb-4 px-4 py-2 bg-[#457B9D] border-3 border-[#1A1A1A]">
              <h2 className="comic-title text-sm text-[#FDFDF8]">The Team</h2>
            </div>

            <div className="space-y-4 comic-text">
              <div className="flex flex-wrap gap-2">
                {teamMembers.map((member, index) => (
                  <div key={index} className="flex items-center gap-2 w-full">
                    <Users size={16} className="text-[#E63946]" />
                    <span className="text-lg">{member}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-4 italic">
                EPFL Master - Applied Data Analysis
              </p>
            </div>
          </motion.div>

          {/* Data Sources */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="border-4 border-[#1A1A1A] bg-white p-6"
            style={{ boxShadow: '5px 5px 0 #1A1A1A' }}
          >
            <div className="inline-block mb-4 px-4 py-2 bg-[#F4A261] border-3 border-[#1A1A1A]">
              <h2 className="comic-title text-sm text-[#FDFDF8]">Data Sources</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <BookOpen size={24} className="text-[#457B9D] mt-1 flex-shrink-0" />
                <div className="comic-text">
                  <p className="comic-title text-[#457B9D] text-lg">The New Yorker</p>
                  <p className="text-sm opacity-80 mb-2">Cartoon Caption Contest</p>
                  <a
                    href="https://www.newyorker.com/cartoons/contest"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-[#E63946] hover:underline break-all"
                  >
                    https://www.newyorker.com/cartoons/contest
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3 pt-4 border-t-2 border-dashed border-gray-200">
                <div className="comic-text text-sm opacity-70">
                  <p>
                    <strong>Dataset Overview:</strong> Our analysis covers contests from 2016 to 2023,
                    including millions of votes, thousands of captions, and detailed image metadata.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 pt-4 border-t-2 border-dashed border-gray-200">
                <div className="comic-text text-sm opacity-70">
                  <p>
                    <strong>Webpage Layout:</strong> The webpage layout was prototyped using Figma Make’s AI website generator (Figma, Inc.)
                  </p>
                </div>
              </div>

              
            </div>
          </motion.div>
        </div>


        {/* Contact & Social */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-12 mb-8"
        >
          <div className="inline-block p-4 bg-[#FFF9E6] border-2 border-[#1A1A1A] rounded-lg transform rotate-[-1deg]">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Heart className="text-[#E63946]" fill="#E63946" size={20} />
              <span className="comic-title text-[#1A1A1A]">Thanks for reading!</span>
            </div>
            <p className="handwritten text-sm text-[#8B4513]">
              "Humor is mankind's greatest blessing." — Mark Twain
            </p>
          </div>
        </motion.div>

        {/* Citation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 p-4 bg-white border-2 border-[#1A1A1A] border-dashed rounded text-center"
        >
          <p className="handwritten text-xs text-[#8B4513] leading-relaxed">
            Data Dinosaur Team © 2025. EPFL Applied Data Analysis Project.
          </p>
        </motion.div>
      </div>
    </div>
  );
}