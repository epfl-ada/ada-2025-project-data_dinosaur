import React from 'react';
import { motion } from 'motion/react';
import { ChevronRight } from 'lucide-react';
import { Starburst } from './ComicElements';

interface BookCoverProps {
  onTurn?: () => void;
}

export function BookCover({ onTurn }: BookCoverProps) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-8 px-6 relative">
      {/* Decorative corners - top starbursts */}
      <div className="absolute top-12 left-12">
        <motion.div
          animate={{ rotate: [0, 5, 0, -5, 0] }}
          transition={{ repeat: Infinity, duration: 4 }}
        >
          <Starburst color="#F4A261" size={80}>
            POW!
          </Starburst>
        </motion.div>
      </div>

      <div className="absolute top-12 right-12">
        <motion.div
          animate={{ rotate: [0, -5, 0, 5, 0] }}
          transition={{ repeat: Infinity, duration: 3.5 }}
        >
          <Starburst color="#457B9D" size={70}>
            HA!
          </Starburst>
        </motion.div>
      </div>

      {/* Main Title */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.1 }}
        className="text-center"
      >
        <h1
          className="comic-title leading-none"
          style={{
            fontSize: 'clamp(5rem, 16vw, 13rem)',
            textShadow: `7px 7px 0px #E63946, 14px 14px 0px #1A1A1A`,
            lineHeight: '0.85',
            letterSpacing: '2px',
            margin: 0,
            color: '#1A1A1A',
          }}
        >
          Chronicle
          <br />
          of Humor
        </h1>
      </motion.div>

      {/* Quick Summary Box */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="bg-[#FFF9E6] border-4 border-[#1A1A1A] px-8 py-4 pt-12 transform rotate-1 max-w-2xl text-center"
        style={{ boxShadow: '5px 5px 0 #1A1A1A' }}
      >
        <p className="comic-text text-center text-base text-[#8B4513] max-w-2xl">
        Exploring Trends and Insights in The New Yorker Caption Contest Through Data Visualization
        </p>
        <span className="comic-title text-[#FDFDF8] text-3xl font-bold">
          By Thara Marie Hayat Belin, Kamegne Yann Eddy Sipofo, Silvia Camenzind, Yuno Reigner and Jannik Jordi</span>
        <p className="comic-text text-center text-base text-[#8B4513] max-w-2xl">
          Jokes often reveal what people care about, fear, or protest against, making humor a mirror of society. We examine how humor changes in reaction to social, political, and international events by analyzing The New Yorker Cartoon Caption Contest dataset (2016–2023).
          Our objective is to create an interactive humor timeline that highlights thematic shifts in jokes, public engagement, and humor types.
          We investigate the relationship between humor trends and significant social events like the US elections, gender inequality and international crises like COVID-19 and climate change. 
          </p>
          <p className="comic-text text-center text-base text-[#8B4513] max-w-2xl">
            After giving a general overview of the dataset, we focus on the following research questions:
          </p>
           <ul className="comic-text text-center text-base text-[#8B4513] max-w-2xl">
              <li>    To what extent do humor trends in The New Yorker Cartoon Caption Contest reflect major societal and global events? </li>
              <li>   Do peaks in caption activity or changes in audience ratings align temporally with political, social, or international crises?</li>
              <li>    How do humor themes and styles evolve over time, and which topics dominate different periods (e.g., politics, social movements, everyday life)?</li>
              <li>   Are shifts in humor topics correlated with public interest as measured by Google search trends for key terms such as “Trump” or “COVID-19”?</li>
              <li>    Are there systematic differences in humor between men and women, indicating gender heterogeneity in humor expression or reception? And how is the gender inequality represented in the captions?</li>
              <li>    Can Large Language Models reliably classify captions into distinct humor types, and how do these humor categories evolve across time and major world events?</li>
          </ul> 

      </motion.div>

      {/* Big CTA Button */}
      <motion.button
        type="button"
        aria-label="Turn the page"
        onClick={() => onTurn?.()}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{
          opacity: 1,
          scale: [1, 1.08, 1]
        }}
        transition={{
          opacity: { duration: 0.8, delay: 0.8 },
          scale: {
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="interactive-cta mt-8 px-16 py-6 text-3xl gap-4"
        style={{
          backgroundColor: '#2A9D8F',
          color: 'white',
          cursor: 'pointer'
        }}
      >
        TURN THE PAGE
        <ChevronRight size={36} />
      </motion.button>

      {/* Bottom corners */}
      <div className="absolute bottom-8 left-8 w-16 h-16 border-l-4 border-b-4 border-[#1A1A1A]" />
      <div className="absolute bottom-8 right-8 w-16 h-16 border-r-4 border-b-4 border-[#1A1A1A]" />
      <div className="absolute top-8 left-8 w-16 h-16 border-l-4 border-t-4 border-[#1A1A1A]" />
      <div className="absolute top-8 right-8 w-16 h-16 border-r-4 border-t-4 border-[#1A1A1A]" />
    </div>
  );
}
