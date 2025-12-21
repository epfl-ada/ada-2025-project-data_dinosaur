import React from 'react';

interface NavigationProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function Navigation({ currentPage, onNavigate }: NavigationProps) {
  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'timeline', label: 'Timeline' },
    { id: 'clusters', label: 'Clusters' },
    { id: 'methodology', label: 'Methodology' },
    { id: 'about', label: 'About' }
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#FDFDF8]/95 backdrop-blur-sm border-b border-[#1A1A1A]/10">
      <div className="max-w-[1440px] mx-auto px-8 py-4 flex justify-between items-center">
        <button 
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2 hover:opacity-70 transition-opacity"
        >
          <div className="w-10 h-10 bg-[#E63946] rounded-full flex items-center justify-center">
            <span className="text-[#FDFDF8]">CH</span>
          </div>
          <span className="font-serif italic">Chronicle of Humor</span>
        </button>
        
        <div className="flex gap-8">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`transition-colors hover:text-[#E63946] ${
                currentPage === item.id ? 'text-[#E63946]' : 'text-[#1A1A1A]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
