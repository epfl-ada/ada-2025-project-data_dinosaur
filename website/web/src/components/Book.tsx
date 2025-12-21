import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';

interface BookProps {
  pages: React.ReactNode[];
  titles: string[];
}

export function Book({ pages, titles }: BookProps) {
  const [current, setCurrent] = useState(0);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const pointerStartX = useRef<number | null>(null);

  const next = () => {
    setCurrent((c) => Math.min(c + 1, pages.length - 1));
  };

  const prev = () => {
    setCurrent((c) => Math.max(c - 1, 0));
  };

  const goTo = (i: number) => {
    if (i >= 0 && i < pages.length) setCurrent(i);
  };

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Pointer (swipe) handlers for touch/mouse
  const onPointerDown = (e: React.PointerEvent) => {
    pointerStartX.current = e.clientX;
    (e.target as Element).setPointerCapture?.(e.pointerId);
  };

  const onPointerUp = (e: React.PointerEvent) => {
    if (pointerStartX.current == null) return;
    const dx = e.clientX - pointerStartX.current;
    pointerStartX.current = null;
    if (Math.abs(dx) < 40) return;
    if (dx < 0) next();
    else prev();
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-gradient-to-br from-[#8B7355] via-[#A0826D] to-[#8B7355]">
      <div
        ref={wrapperRef}
        className="relative bg-[#FDFDF8] overflow-hidden shadow-lg"
        style={{ width: '100vw', height: '100vh' }}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
      >
        {/* Left Spine */}
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 56, zIndex: 30 }}>
          <div
            style={{
              height: '100%',
              background: 'linear-gradient(90deg,#8B4513,#A0522D)',
              boxShadow: 'inset -3px 0 6px rgba(0,0,0,0.4)',
            }}
          />
        </div>

        {/* Content area */}
        <div style={{ marginLeft: 56, height: '100%', position: 'relative' }}>
          <div style={{ position: 'absolute', inset: 0, overflow: 'auto', padding: 28 }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.33 }}
                className="w-full h-full"
                style={{
                  // For BookCover (page 0), remove spine/padding offsets to center properly
                  marginLeft: current === 0 ? -56 : 0,
                  paddingLeft: current === 0 ? 56 : 0,
                  paddingRight: current === 0 ? 0 : 0,
                  paddingTop: current === 0 ? 0 : 28,
                  paddingBottom: current === 0 ? 0 : 28,
                }}
              >
                {React.isValidElement(pages[current])
                  ? React.cloneElement(pages[current] as React.ReactElement, { onTurn: next, onNext: next, onPrev: prev } as any)
                  : pages[current]
                }
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Page position indicator */}
          <div style={{ position: 'absolute', right: 20, bottom: 18, zIndex: 50 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <BookOpen size={16} className="text-[#8B4513]" />
              <span className="handwritten text-2xl text-[#8B4513]">{current + 1} / {pages.length}</span>
            </div>
          </div>

          {/* Prev/Next buttons (visible) */}
          <button
            onClick={prev}
            aria-label="Previous page"
            style={{
              position: 'absolute',
              left: 20,
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 60,
              width: 48,
              height: 48,
              borderRadius: '999px',
              border: '3px solid #1A1A1A',
              background: current === 0 ? '#ccc' : '#E63946',
              color: '#fff',
              boxShadow: '4px 4px 0 #1A1A1A',
            }}
            disabled={current === 0}
          >
            <ChevronLeft size={22} />
          </button>

          <button
            onClick={next}
            aria-label="Next page"
            style={{
              position: 'absolute',
              right: 20,
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 60,
              width: 48,
              height: 48,
              borderRadius: '999px',
              border: '3px solid #1A1A1A',
              background: current === pages.length - 1 ? '#ccc' : '#E63946',
              color: '#fff',
              boxShadow: '4px 4px 0 #1A1A1A',
            }}
            disabled={current === pages.length - 1}
          >
            <ChevronRight size={22} />
          </button>

          {/* Dots */}
          <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', bottom: 18, zIndex: 50, display: 'flex', gap: 8 }}>
            {pages.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Go to page ${i + 1}`}
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 10,
                  border: '2px solid #1A1A1A',
                  background: i === current ? '#E63946' : '#FDFDF8',
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
