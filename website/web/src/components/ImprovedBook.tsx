import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';

interface BookProps {
  pages: React.ReactNode[];
  titles: string[];
}

export function ImprovedBook({ pages, titles }: BookProps) {
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [direction, setDirection] = useState<'next' | 'prev'>('next');
  const [isFlipping, setIsFlipping] = useState(false);

  const nextPage = () => {
    if (currentPageIndex < pages.length - 1 && !isFlipping) {
      setIsFlipping(true);
      setDirection('next');
      setTimeout(() => {
        setCurrentPageIndex(currentPageIndex + 1);
        setIsFlipping(false);
      }, 300);
    }
  };

  const prevPage = () => {
    if (currentPageIndex > 0 && !isFlipping) {
      setIsFlipping(true);
      setDirection('prev');
      setTimeout(() => {
        setCurrentPageIndex(currentPageIndex - 1);
        setIsFlipping(false);
      }, 300);
    }
  };

  const goToPage = (index: number) => {
    if (index !== currentPageIndex && index >= 0 && index < pages.length && !isFlipping) {
      setIsFlipping(true);
      setDirection(index > currentPageIndex ? 'next' : 'prev');
      setTimeout(() => {
        setCurrentPageIndex(index);
        setIsFlipping(false);
      }, 300);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#8B7355] via-[#A0826D] to-[#8B7355] relative overflow-hidden">
      {/* Ambient background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-64 h-64 bg-[#8B4513] rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-64 h-64 bg-[#A0522D] rounded-full blur-3xl" />
      </div>

      {/* Book Container */}
      <div className="relative z-10" style={{ perspective: '2000px' }}>
        {/* Book Shadow */}
        <div className="absolute inset-0 bg-black/50 blur-3xl transform translate-y-12 scale-95" />
        
        {/* The Book */}
        <motion.div 
          className="relative bg-[#FDFDF8] rounded-r-2xl overflow-hidden"
          initial={{ rotateY: -5 }}
          animate={{ rotateY: 0 }}
          style={{
            width: '90vw',
            maxWidth: '1400px',
            height: '85vh',
            maxHeight: '900px',
            boxShadow: `
              -20px 0 60px rgba(0,0,0,0.4),
              20px 0 60px rgba(0,0,0,0.3),
              inset -10px 0 20px rgba(0,0,0,0.1),
              inset 10px 0 20px rgba(139, 69, 19, 0.1)
            `,
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Book Spine with Texture */}
          <div 
            className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[#6B3410] via-[#8B4513] to-[#6B3410] overflow-hidden"
            style={{
              boxShadow: `
                inset -8px 0 15px rgba(0,0,0,0.6),
                inset 8px 0 15px rgba(0,0,0,0.4),
                inset 0 10px 20px rgba(0,0,0,0.3)
              `,
            }}
          >
            {/* Spine ridges */}
            <div className="absolute inset-0 opacity-20">
              {[...Array(20)].map((_, i) => (
                <div 
                  key={i} 
                  className="absolute left-0 right-0 h-px bg-black"
                  style={{ top: `${i * 5}%` }}
                />
              ))}
            </div>

            {/* Spine Title */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 -rotate-90 whitespace-nowrap">
              <h2 className="comic-title text-[#F5DEB3] text-xl tracking-widest drop-shadow-lg">
                CHRONICLE OF HUMOR
              </h2>
            </div>

            {/* Spine decorative lines */}
            <div className="absolute top-8 left-2 right-2 h-0.5 bg-[#F5DEB3]/30" />
            <div className="absolute bottom-8 left-2 right-2 h-0.5 bg-[#F5DEB3]/30" />
          </div>

          {/* Pages Content Area */}
          <div className="ml-20 h-full relative overflow-hidden bg-[#FDFDF8]">
            {/* Paper texture overlay */}
            <div 
              className="absolute inset-0 opacity-20 pointer-events-none"
              style={{
                backgroundImage: `
                  repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(139, 69, 19, 0.03) 2px, rgba(139, 69, 19, 0.03) 4px),
                  repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(139, 69, 19, 0.03) 2px, rgba(139, 69, 19, 0.03) 4px)
                `,
              }}
            />

            {/* Page edge shadow */}
            <div 
              className="absolute left-0 top-0 bottom-0 w-8 pointer-events-none"
              style={{
                background: 'linear-gradient(to right, rgba(0,0,0,0.1), transparent)',
              }}
            />

            {/* Animated Pages with Enhanced 3D Effect */}
            <div className="relative h-full" style={{ transformStyle: 'preserve-3d' }}>
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={currentPageIndex}
                  custom={direction}
                  initial={direction === 'next' ? {
                    rotateY: -90,
                    opacity: 0,
                    x: -100,
                    scale: 0.8,
                  } : {
                    rotateY: 90,
                    opacity: 0,
                    x: 100,
                    scale: 0.8,
                  }}
                  animate={{
                    rotateY: 0,
                    opacity: 1,
                    x: 0,
                    scale: 1,
                  }}
                  exit={direction === 'next' ? {
                    rotateY: 90,
                    opacity: 0,
                    x: 100,
                    scale: 0.8,
                  } : {
                    rotateY: -90,
                    opacity: 0,
                    x: -100,
                    scale: 0.8,
                  }}
                  transition={{
                    duration: 0.7,
                    ease: [0.32, 0.72, 0, 1],
                  }}
                  className="absolute inset-0 p-12 overflow-y-auto"
                  style={{
                    transformStyle: 'preserve-3d',
                    transformOrigin: direction === 'next' ? 'left center' : 'right center',
                    backfaceVisibility: 'hidden',
                  }}
                >
                  {/* Page curl shadow effect */}
                  {isFlipping && (
                    <motion.div
                      className="absolute inset-0 pointer-events-none"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0, 0.3, 0] }}
                      transition={{ duration: 0.7 }}
                      style={{
                        background: direction === 'next'
                          ? 'linear-gradient(to right, transparent, rgba(0,0,0,0.2), transparent)'
                          : 'linear-gradient(to left, transparent, rgba(0,0,0,0.2), transparent)',
                      }}
                    />
                  )}
                  
                  {pages[currentPageIndex]}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Page Number */}
            <div className="absolute bottom-8 right-12 flex items-center gap-3 bg-white/80 px-4 py-2 rounded-lg border-2 border-[#8B4513]/20">
              <BookOpen size={18} className="text-[#8B4513]" />
              <span className="handwritten text-2xl text-[#8B4513]">
                {currentPageIndex + 1} / {pages.length}
              </span>
            </div>
          </div>

          {/* Navigation Buttons with Better Styling */}
          <motion.button
            onClick={prevPage}
            disabled={currentPageIndex === 0 || isFlipping}
            whileHover={currentPageIndex > 0 && !isFlipping ? { scale: 1.1, x: -5 } : {}}
            whileTap={currentPageIndex > 0 && !isFlipping ? { scale: 0.95 } : {}}
            className={`absolute left-24 top-1/2 transform -translate-y-1/2 w-16 h-16 rounded-full border-4 border-[#1A1A1A] flex items-center justify-center transition-all ${
              currentPageIndex === 0 || isFlipping
                ? 'bg-gray-300 cursor-not-allowed opacity-40' 
                : 'bg-[#E63946] hover:bg-[#d32f3d] shadow-lg hover:shadow-[0_0_20px_rgba(230,57,70,0.6)]'
            }`}
            style={{ boxShadow: currentPageIndex > 0 ? '5px 5px 0 #1A1A1A' : 'none' }}
            title={currentPageIndex > 0 ? "Previous page" : ""}
          >
            <ChevronLeft size={32} className="text-[#FDFDF8]" />
          </motion.button>

          <motion.button
            onClick={nextPage}
            disabled={currentPageIndex === pages.length - 1 || isFlipping}
            whileHover={currentPageIndex < pages.length - 1 && !isFlipping ? { scale: 1.1, x: 5 } : {}}
            whileTap={currentPageIndex < pages.length - 1 && !isFlipping ? { scale: 0.95 } : {}}
            className={`absolute right-8 top-1/2 transform -translate-y-1/2 w-16 h-16 rounded-full border-4 border-[#1A1A1A] flex items-center justify-center transition-all ${
              currentPageIndex === pages.length - 1 || isFlipping
                ? 'bg-gray-300 cursor-not-allowed opacity-40' 
                : 'bg-[#E63946] hover:bg-[#d32f3d] shadow-lg hover:shadow-[0_0_20px_rgba(230,57,70,0.6)]'
            }`}
            style={{ boxShadow: currentPageIndex < pages.length - 1 ? '5px 5px 0 #1A1A1A' : 'none' }}
            title={currentPageIndex < pages.length - 1 ? "Next page" : ""}
          >
            <ChevronRight size={32} className="text-[#FDFDF8]" />
          </motion.button>

          {/* Page Navigation Dots */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-3 bg-white/90 px-6 py-3 rounded-full border-3 border-[#1A1A1A]" style={{ boxShadow: '4px 4px 0 #1A1A1A' }}>
            {pages.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => goToPage(index)}
                whileHover={{ scale: 1.3 }}
                whileTap={{ scale: 0.9 }}
                disabled={isFlipping}
                animate={index === currentPageIndex ? { scale: [1.25, 1.35, 1.25] } : {}}
                transition={index === currentPageIndex ? { duration: 2, repeat: Infinity } : {}}
                className={`w-3 h-3 rounded-full border-2 border-[#1A1A1A] transition-all ${
                  index === currentPageIndex 
                    ? 'bg-[#E63946] shadow-[0_0_10px_rgba(230,57,70,0.5)]' 
                    : 'bg-[#FDFDF8] hover:bg-[#F4A261]'
                }`}
                title={titles[index]}
                style={{
                  boxShadow: index === currentPageIndex ? '2px 2px 0 #1A1A1A' : 'none'
                }}
              />
            ))}
          </div>

          {/* Corner decorations */}
          <div className="absolute top-0 right-0 w-20 h-20 pointer-events-none opacity-10">
            <div className="absolute top-0 right-0 w-full h-0.5 bg-[#8B4513]" />
            <div className="absolute top-0 right-0 w-0.5 h-full bg-[#8B4513]" />
          </div>
          <div className="absolute bottom-0 right-0 w-20 h-20 pointer-events-none opacity-10">
            <div className="absolute bottom-0 right-0 w-full h-0.5 bg-[#8B4513]" />
            <div className="absolute bottom-0 right-0 w-0.5 h-full bg-[#8B4513]" />
          </div>
        </motion.div>

        {/* Floating page indicator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-white/90 px-6 py-3 rounded-lg border-4 border-[#1A1A1A] shadow-xl"
          style={{ boxShadow: '5px 5px 0 #1A1A1A' }}
        >
          <p className="comic-title text-[#8B4513] text-lg">
            {titles[currentPageIndex]}
          </p>
        </motion.div>
      </div>
    </div>
  );
}