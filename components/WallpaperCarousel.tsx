import React, { useState, useRef, useEffect, useCallback } from 'react';
import { WALLPAPERS_DATA } from '../constants';
import type { Wallpaper } from '../types';
import { ChevronDown } from 'lucide-react';

interface WallpaperCarouselProps {
  onScrollDown: () => void;
}

const WallpaperCarousel: React.FC<WallpaperCarouselProps> = ({ onScrollDown }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(Math.floor(WALLPAPERS_DATA.length / 2));
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const itemWidthRef = useRef<number>(0);

  const handleScroll = useCallback(() => {
    if (scrollContainerRef.current) {
      const { scrollLeft } = scrollContainerRef.current;
      const newIndex = Math.round(scrollLeft / itemWidthRef.current);
      if (newIndex !== currentIndex) {
        setCurrentIndex(newIndex);
      }
    }
  }, [currentIndex]);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      const firstChild = scrollContainer.children[0] as HTMLElement;
      if (firstChild) {
          const style = window.getComputedStyle(firstChild);
          const marginRight = parseFloat(style.marginRight);
          itemWidthRef.current = firstChild.offsetWidth + marginRight;
          scrollContainer.scrollLeft = itemWidthRef.current * Math.floor(WALLPAPERS_DATA.length / 2);
      }
      scrollContainer.addEventListener('scroll', handleScroll, { passive: true });
    }
    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener('scroll', handleScroll);
      }
    };
  }, [handleScroll]);

  return (
    <div className="relative flex flex-col items-center justify-center h-screen w-full select-none pt-12 pb-20">
      <h1 className="absolute top-10 text-3xl md:top-16 md:text-4xl text-stone-700 tracking-wider">Shunya</h1>
      
      <div 
        ref={scrollContainerRef}
        className="flex items-center w-full h-full overflow-x-auto snap-x snap-mandatory scroll-smooth px-[50vw] no-scrollbar"
        style={{ scrollPaddingLeft: '50vw' }}
      >
        {WALLPAPERS_DATA.map((wallpaper: Wallpaper, index: number) => {
          const distance = Math.abs(index - currentIndex);
          const scale = Math.max(1 - distance * 0.1, 0);
          const opacity = Math.max(1 - distance * 0.3, 0);

          return (
            <div 
              key={wallpaper.id} 
              className="flex-shrink-0 snap-center w-[45vh] sm:w-[50vh] md:w-[40vh] mx-4 md:mx-8 flex flex-col items-center justify-center transition-all duration-300 ease-out"
              style={{
                transform: `scale(${scale})`,
                opacity: opacity,
              }}
            >
              <img
                src={wallpaper.imageUrl}
                alt={wallpaper.title}
                className="h-[80vh] w-full object-cover rounded-3xl shadow-2xl bg-stone-200"
              />
              <p className={`mt-4 text-stone-600 transition-opacity duration-300 ${currentIndex === index ? 'opacity-100' : 'opacity-0'}`}>
                {wallpaper.title}
              </p>
            </div>
          );
        })}
      </div>
      
      <div onClick={onScrollDown} className="absolute bottom-8 flex flex-col items-center text-amber-700 cursor-pointer animate-bounce">
        <span className="text-sm tracking-widest">ARTIST</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
      </div>

      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 opacity-50 hidden md:block">Scroll</div>
      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 opacity-50 hidden md:block">Scroll</div>
    </div>
  );
};

export default WallpaperCarousel;