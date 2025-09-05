
import React from 'react';
import { ARTIST_DATA } from '../constants';

interface ArtistProfileProps {
  onScrollUp: () => void;
}

const ArtistProfile: React.FC<ArtistProfileProps> = ({ onScrollUp }) => {
  return (
    <div className="relative flex flex-col items-center justify-center h-screen w-full text-stone-800 p-8">
       <div onClick={onScrollUp} className="absolute top-8 flex flex-col items-center text-amber-700 cursor-pointer animate-bounce">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6"/></svg>
        <span className="text-sm tracking-widest">GALLERY</span>
      </div>

      <div className="max-w-2xl text-center flex flex-col items-center">
        <img
          src={ARTIST_DATA.imageUrl}
          alt={ARTIST_DATA.name}
          className="w-32 h-32 rounded-full object-cover mb-6 shadow-lg border-4 border-stone-200"
        />
        <h2 className="text-4xl font-bold tracking-wide text-amber-900">{ARTIST_DATA.name}</h2>
        <p className="mt-4 text-lg leading-relaxed text-stone-700">
          {ARTIST_DATA.bio}
        </p>
        <div className="mt-8 border-t border-amber-600/30 pt-6 w-full max-w-sm">
          <p className="text-md text-stone-600">
            Contact: <a href={`mailto:${ARTIST_DATA.email}`} className="text-amber-800 hover:underline">{ARTIST_DATA.email}</a>
          </p>
          <p className="mt-2 text-md text-stone-600">
            Portfolio: <a href={`https://${ARTIST_DATA.portfolio}`} target="_blank" rel="noopener noreferrer" className="text-amber-800 hover:underline">{ARTIST_DATA.portfolio}</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ArtistProfile;
