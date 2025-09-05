
import React, { useState, useEffect, useRef } from 'react';
import WallpaperCarousel from './components/WallpaperCarousel';
import ArtistProfile from './components/ArtistProfile';

const App: React.FC = () => {
  const [isArtistViewVisible, setIsArtistViewVisible] = useState<boolean>(false);
  const isScrolling = useRef<boolean>(false);
  // Fix: Use ReturnType<typeof setTimeout> for the timeout ID to ensure compatibility with browser environments.
  const scrollTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleWheel = (event: WheelEvent) => {
      if (isScrolling.current) return;

      isScrolling.current = true;
      
      if (event.deltaY > 40 && !isArtistViewVisible) {
        setIsArtistViewVisible(true);
      } else if (event.deltaY < -40 && isArtistViewVisible) {
        setIsArtistViewVisible(false);
      }

      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }

      scrollTimeout.current = setTimeout(() => {
        isScrolling.current = false;
      }, 1200); // Cooldown to match transition duration
    };

    window.addEventListener('wheel', handleWheel);

    return () => {
      window.removeEventListener('wheel', handleWheel);
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
    };
  }, [isArtistViewVisible]);

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-emerald-50 font-serif">
      {/* Animated Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-stone-100 via-emerald-100 to-amber-100 animate-[pulse_15s_ease-in-out_infinite]"></div>
        <div 
          className="absolute inset-0 opacity-10" 
          style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23a3b18a\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
            backgroundSize: '100px 100px'
          }}
        ></div>
      </div>
      
      <div className="relative z-10 h-full w-full">
        {/* Wallpaper Carousel Screen */}
        <div className={`absolute top-0 left-0 h-full w-full transition-transform duration-1000 ease-in-out ${isArtistViewVisible ? '-translate-y-full' : 'translate-y-0'}`}>
          <WallpaperCarousel onScrollDown={() => setIsArtistViewVisible(true)} />
        </div>
        
        {/* Artist Profile Screen */}
        <div className={`absolute top-0 left-0 h-full w-full transition-transform duration-1000 ease-in-out ${isArtistViewVisible ? 'translate-y-0' : 'translate-y-full'}`}>
          <ArtistProfile onScrollUp={() => setIsArtistViewVisible(false)} />
        </div>
      </div>
    </main>
  );
};

export default App;
