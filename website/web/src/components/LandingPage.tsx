import React from 'react';
import { motion } from 'motion/react';
import { TrendingUp, BookOpen, Laugh, Calendar } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { SpeechBubble, Starburst, ComicPanel, SoundEffect } from './ComicElements';

interface LandingPageProps {
  onExplore: () => void;
}

export function LandingPage({ onExplore }: LandingPageProps) {
  const stats = [
    { icon: BookOpen, value: '587', label: 'Cartoons Analyzed', color: '#457B9D' },
    { icon: Calendar, value: '2016-2023', label: 'Years Covered', color: '#E63946' },
    { icon: Laugh, value: '5', label: 'Humor Clusters', color: '#2A9D8F' },
    { icon: TrendingUp, value: '12,000+', label: 'Data Points', color: '#F4A261' }
  ];

  // Mock word cloud words
  const words = [
    { text: 'pandemic', size: 72, x: 20, y: 30 },
    { text: 'politics', size: 64, x: 45, y: 25 },
    { text: 'climate', size: 56, x: 15, y: 60 },
    { text: 'technology', size: 48, x: 60, y: 55 },
    { text: 'election', size: 52, x: 35, y: 45 },
    { text: 'social', size: 44, x: 70, y: 35 },
    { text: 'media', size: 40, x: 25, y: 75 },
    { text: 'work', size: 36, x: 55, y: 70 },
    { text: 'home', size: 38, x: 42, y: 65 },
    { text: 'mask', size: 34, x: 80, y: 50 }
  ];

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <div className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Comic-style background effects */}
        <div className="absolute top-10 right-10">
          <motion.div
            animate={{ rotate: [0, 5, 0, -5, 0] }}
            transition={{ repeat: Infinity, duration: 3 }}
          >
            <Starburst color="#F4A261" size={100}>
              POW!
            </Starburst>
          </motion.div>
        </div>

        <div className="absolute bottom-20 left-10">
          <motion.div
            animate={{ rotate: [0, -5, 0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 2.5, delay: 0.5 }}
          >
            <Starburst color="#457B9D" size={80}>
              HA!
            </Starburst>
          </motion.div>
        </div>

        {/* Animated Word Cloud Background */}
        <div className="absolute inset-0 opacity-10">
          {words.map((word, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="absolute font-serif italic text-[#E63946]"
              style={{
                fontSize: `${word.size}px`,
                left: `${word.x}%`,
                top: `${word.y}%`,
              }}
            >
              {word.text}
            </motion.div>
          ))}
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center max-w-4xl px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <h1 className="comic-title mb-6 text-6xl" style={{
              textShadow: `4px 4px 0px #E63946,
                           8px 8px 0px #1A1A1A`
            }}>
              Chronicle of Humor
            </h1>
            <div className="inline-block bg-[#E63946] px-6 py-2 border-4 border-[#1A1A1A] transform -rotate-2 shadow-lg">
              <span className="comic-title text-[#FDFDF8] text-2xl">2016-2023</span>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-8"
          >
            <SpeechBubble color="#FDFDF8" className="max-w-2xl mx-auto">
              <p className="text-lg">
                Exploring the evolution of humor through The New Yorker cartoon caption contest. 
                Discover how wit, wordplay, and world events intersected over eight transformative years.
              </p>
            </SpeechBubble>
          </motion.div>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            onClick={onExplore}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="comic-title bg-[#E63946] text-[#FDFDF8] px-12 py-4 text-xl border-4 border-[#1A1A1A] shadow-lg hover:shadow-xl transition-all"
            style={{ boxShadow: '6px 6px 0px #1A1A1A' }}
          >
            Explore the Timeline!
          </motion.button>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-12 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="handwritten text-2xl text-[#E63946]"
          >
            ↓
          </motion.div>
        </motion.div>
      </div>

      {/* Stats Section */}
      <div className="max-w-[1440px] mx-auto px-8 py-24">
        <div className="text-center mb-12">
          <SoundEffect text="By the Numbers!" color="#E63946" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <ComicPanel className="p-8 hover:scale-105 transition-transform">
                <stat.icon 
                  size={48} 
                  style={{ color: stat.color }}
                  className="mb-4"
                />
                <div className="comic-title text-3xl mb-2" style={{ color: stat.color }}>
                  {stat.value}
                </div>
                <p className="comic-text">{stat.label}</p>
              </ComicPanel>
            </motion.div>
          ))}
        </div>
      </div>

      {/* About Section */}
      <div className="max-w-[1440px] mx-auto px-8 py-24 border-t-4 border-[#1A1A1A] border-dashed">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-block mb-6">
              <Starburst color="#2A9D8F" size={140}>
                The Story
              </Starburst>
            </div>
            <ComicPanel className="p-6">
              <p className="comic-text mb-4">
                This interactive visualization explores humor evolution through The New Yorker's 
                iconic cartoon caption contest database, spanning 2016 to 2023. Using machine learning 
                clustering and natural language processing, we identified distinct humor types and 
                tracked their correlation with world events.
              </p>
              <p className="comic-text mb-4">
                Through analysis of word frequency, Google Trends data, and temporal patterns, 
                this project reveals how humor adapts to and reflects our changing world—from 
                pandemic anxieties to political upheaval.
              </p>
              <button 
                onClick={onExplore}
                className="comic-title text-[#E63946] bg-[#FFF] border-3 border-[#E63946] px-6 py-2 hover:bg-[#E63946] hover:text-white transition-all flex items-center gap-2 group"
              >
                Start Exploring 
                <span className="group-hover:translate-x-1 transition-transform text-2xl">→</span>
              </button>
            </ComicPanel>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <ComicPanel className="h-[400px] overflow-hidden">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1552146455-4b961f2ed173?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZXdzcGFwZXIlMjBtYWdhemluZSUyMGVkaXRvcmlhbHxlbnwxfHx8fDE3NjQwMTQ4MzZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Editorial visualization"
                className="w-full h-full object-cover"
              />
            </ComicPanel>
            
            {/* Comic callout */}
            <div className="absolute -top-4 -right-4">
              <SpeechBubble color="#F4A261" position="left" className="w-32">
                <p className="text-sm">Check this out!</p>
              </SpeechBubble>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}