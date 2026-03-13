import React from 'react';
import { Movie } from '../types';
import { Star, Calendar, Globe, Info, PlayCircle } from 'lucide-react';
import { motion } from 'motion/react';

interface MovieCardProps {
  movie: Movie;
}

export const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:border-emerald-500/50 transition-colors group"
    >
      <div className="aspect-[2/3] bg-zinc-800 relative flex items-center justify-center overflow-hidden">
        <img 
          src={`https://picsum.photos/seed/${encodeURIComponent(movie.title)}/400/600`}
          alt={movie.title}
          className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent" />
        <div className="absolute top-4 right-4 bg-emerald-500 text-black px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1 shadow-lg">
          <Star size={12} fill="black" />
          {movie.rating}
        </div>
        
        {/* OTT Platforms Overlay */}
        {movie.streamingPlatforms && movie.streamingPlatforms.length > 0 && (
          <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-2">
            {movie.streamingPlatforms.map((platform, i) => (
              <span key={i} className="px-2 py-1 bg-black/60 backdrop-blur-md border border-white/10 rounded-lg text-[10px] font-bold text-white flex items-center gap-1">
                <PlayCircle size={10} className="text-emerald-500" />
                {platform}
              </span>
            ))}
          </div>
        )}
      </div>
      
      <div className="p-5 space-y-3">
        <div>
          <h3 className="text-lg font-bold text-white line-clamp-1">{movie.title}</h3>
          <div className="flex items-center gap-3 text-zinc-400 text-xs mt-1">
            <span className="flex items-center gap-1">
              <Calendar size={12} />
              {movie.year}
            </span>
            <span className="flex items-center gap-1">
              <Globe size={12} />
              {movie.language}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {movie.genre.slice(0, 3).map((g, i) => (
            <span key={i} className="px-2 py-0.5 bg-zinc-800 text-zinc-300 rounded-md text-[10px] uppercase tracking-wider font-semibold">
              {g}
            </span>
          ))}
        </div>

        <p className="text-zinc-400 text-sm line-clamp-3 leading-relaxed">
          {movie.description}
        </p>

        <div className="pt-2 flex items-center justify-between">
          <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">{movie.country}</span>
          <button className="text-emerald-500 hover:text-emerald-400 transition-colors">
            <Info size={18} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
