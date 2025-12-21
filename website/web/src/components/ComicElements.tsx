import React from 'react';
import { motion } from 'motion/react';

interface SpeechBubbleProps {
  children: React.ReactNode;
  color?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}

export function SpeechBubble({ children, color = 'white', position = 'bottom', className = '' }: SpeechBubbleProps) {
  const tailPaths = {
    bottom: 'M 50 100 L 30 120 L 60 100 Z',
    top: 'M 50 0 L 30 -20 L 60 0 Z',
    left: 'M 0 50 L -20 30 L 0 60 Z',
    right: 'M 100 50 L 120 30 L 100 60 Z'
  };

  return (
    <div className={`relative ${className}`}>
      <div 
        className="speech-bubble comic-text"
        style={{ background: color }}
      >
        {children}
      </div>
      <svg 
        className="absolute" 
        style={{
          [position]: '-15px',
          left: position === 'bottom' || position === 'top' ? '20px' : 'auto',
          right: position === 'right' ? '-15px' : 'auto',
        }}
        width="40" 
        height="40" 
        viewBox="0 0 100 100"
      >
        <path 
          d={tailPaths[position]} 
          fill={color} 
          stroke="#1A1A1A" 
          strokeWidth="3"
        />
      </svg>
    </div>
  );
}

interface StarburstProps {
  children: React.ReactNode;
  color: string;
  size?: number;
  className?: string;
}

export function Starburst({ children, color, size = 120, className = '' }: StarburstProps) {
  return (
    <div 
      className={`starburst flex items-center justify-center ${className}`}
      style={{ 
        width: size, 
        height: size, 
        backgroundColor: color,
        filter: 'drop-shadow(4px 4px 0px #1A1A1A)'
      }}
    >
      <div className="comic-title text-[#FDFDF8] text-center">
        {children}
      </div>
    </div>
  );
}

interface ComicPanelProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
}

export function ComicPanel({ children, className = '', title }: ComicPanelProps) {
  return (
    <div className={`comic-panel bg-white rounded-lg ${className}`}>
      {title && (
        <div className="absolute -top-6 left-4 bg-[#E63946] px-4 py-1 rounded-t-lg border-4 border-b-0 border-[#1A1A1A]">
          <span className="comic-title text-[#FDFDF8] text-sm">{title}</span>
        </div>
      )}
      {children}
    </div>
  );
}

interface SoundEffectProps {
  text: string;
  color?: string;
  rotation?: number;
  className?: string;
}

export function SoundEffect({ text, color = '#F4A261', rotation = 0, className = '' }: SoundEffectProps) {
  return (
    <motion.div
      initial={{ scale: 0, rotate: rotation }}
      animate={{ scale: 1, rotate: rotation }}
      transition={{ type: 'spring', stiffness: 200 }}
      className={`comic-title text-6xl ${className}`}
      style={{ 
        color,
        textShadow: `4px 4px 0px #1A1A1A,
                     -2px -2px 0px white,
                     2px -2px 0px white,
                     -2px 2px 0px white,
                     2px 2px 0px white`,
        WebkitTextStroke: '2px #1A1A1A'
      }}
    >
      {text}
    </motion.div>
  );
}

export function ThoughtBubble({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`relative ${className}`}>
      {/* Small bubbles leading to main thought */}
      <div className="absolute -bottom-8 left-4 w-3 h-3 bg-white border-2 border-[#1A1A1A] rounded-full" />
      <div className="absolute -bottom-12 left-8 w-2 h-2 bg-white border-2 border-[#1A1A1A] rounded-full" />
      
      <div className="thought-bubble comic-text">
        {children}
      </div>
    </div>
  );
}

interface ComicArrowProps {
  direction?: 'up' | 'down' | 'left' | 'right';
  color?: string;
  label?: string;
  className?: string;
}

export function ComicArrow({ direction = 'right', color = '#E63946', label, className = '' }: ComicArrowProps) {
  const rotations = {
    up: -90,
    down: 90,
    left: 180,
    right: 0
  };

  return (
    <div 
      className={`flex items-center gap-2 ${className}`}
      style={{ transform: `rotate(${rotations[direction]}deg)` }}
    >
      {label && (
        <span className="handwritten" style={{ color }}>
          {label}
        </span>
      )}
      <svg width="40" height="20" viewBox="0 0 40 20">
        <path
          d="M 0 10 L 30 10 M 30 10 L 22 2 M 30 10 L 22 18"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
    </div>
  );
}
