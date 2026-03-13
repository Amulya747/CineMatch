import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Smile, 
  Search, 
  Clapperboard, 
  History as HistoryIcon,
  Loader2,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Movie, HistoryItem, MOODS, GENRES } from './types';
import { getRecommendations, saveToHistory, fetchHistory } from './services/geminiService';
import { MovieCard } from './components/MovieCard';

type Tab = 'dashboard' | 'mood' | 'movie' | 'genre' | 'history';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Movie[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);

  useEffect(() => {
    loadHistory();
    // Load some featured movies on dashboard
    handleRecommendation('dashboard', 'Recommend 6 popular and diverse movies from different countries and genres.');
  }, []);

  const loadHistory = async () => {
    const data = await fetchHistory();
    setHistory(data);
  };

  const handleRecommendation = async (type: Tab, prompt: string, query?: string) => {
    setLoading(true);
    setResults([]);
    const movies = await getRecommendations(prompt);
    setResults(movies);
    setLoading(false);
    
    if (type !== 'dashboard' && movies.length > 0) {
      await saveToHistory(type, query || prompt, movies);
      loadHistory();
    }
  };

  const renderDashboard = () => (
    <div className="space-y-8 pb-24">
      <header className="space-y-2">
        <h1 className="text-4xl font-black text-white tracking-tighter">CineMatch <span className="text-emerald-500">AI</span></h1>
        <p className="text-zinc-400">Your personal cinema concierge powered by Gemini.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {results.map((movie, i) => (
          <MovieCard key={i} movie={movie} />
        ))}
      </div>
    </div>
  );

  const renderMood = () => (
    <div className="space-y-8 pb-24">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold text-white tracking-tight">How are you feeling?</h2>
        <p className="text-zinc-400">Pick a mood and we'll find the perfect match.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {MOODS.map((mood) => (
          <button
            key={mood.label}
            onClick={() => {
              setSelectedMood(mood.label);
              handleRecommendation('mood', `Recommend 6 movies that are ${mood.prompt}. Focus on diverse international cinema.`, mood.label);
            }}
            className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 ${
              selectedMood === mood.label 
                ? 'bg-emerald-500/10 border-emerald-500 text-emerald-500' 
                : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'
            }`}
          >
            <span className="text-4xl">{mood.icon}</span>
            <span className="font-bold">{mood.label}</span>
          </button>
        ))}
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center py-12 gap-4">
          <Loader2 className="animate-spin text-emerald-500" size={40} />
          <p className="text-zinc-400 animate-pulse">Consulting the cinema oracle...</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {results.map((movie, i) => (
          <MovieCard key={i} movie={movie} />
        ))}
      </div>
    </div>
  );

  const renderMovieSearch = () => (
    <div className="space-y-8 pb-24">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold text-white tracking-tight">Similar to...</h2>
        <p className="text-zinc-400">Enter a movie you loved, and we'll find more like it.</p>
      </div>

      <div className="relative">
        <input 
          type="text"
          placeholder="Enter a movie title..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && searchQuery) {
              handleRecommendation('movie', `Recommend 6 movies similar to "${searchQuery}". Include a mix of well-known and hidden gems from around the world.`, searchQuery);
            }
          }}
          className="w-full bg-zinc-900 border-2 border-zinc-800 rounded-2xl px-6 py-4 text-white focus:border-emerald-500 outline-none transition-all pr-16"
        />
        <button 
          onClick={() => searchQuery && handleRecommendation('movie', `Recommend 6 movies similar to "${searchQuery}".`, searchQuery)}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-emerald-500 rounded-xl text-black hover:bg-emerald-400 transition-colors"
        >
          <Search size={20} />
        </button>
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center py-12 gap-4">
          <Loader2 className="animate-spin text-emerald-500" size={40} />
          <p className="text-zinc-400 animate-pulse">Analyzing cinematic patterns...</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {results.map((movie, i) => (
          <MovieCard key={i} movie={movie} />
        ))}
      </div>
    </div>
  );

  const renderGenre = () => (
    <div className="space-y-8 pb-24">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold text-white tracking-tight">Genre Explorer</h2>
        <p className="text-zinc-400">Select one or more genres to narrow down your search.</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {GENRES.map((genre) => (
          <button
            key={genre}
            onClick={() => {
              const newGenres = selectedGenres.includes(genre)
                ? selectedGenres.filter(g => g !== genre)
                : [...selectedGenres, genre];
              setSelectedGenres(newGenres);
            }}
            className={`px-4 py-2 rounded-full border transition-all text-sm font-medium ${
              selectedGenres.includes(genre)
                ? 'bg-emerald-500 border-emerald-500 text-black'
                : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'
            }`}
          >
            {genre}
          </button>
        ))}
      </div>

      <button
        disabled={selectedGenres.length === 0 || loading}
        onClick={() => handleRecommendation('genre', `Recommend 6 movies that fall into these genres: ${selectedGenres.join(', ')}. Focus on high-quality international films.`, selectedGenres.join(', '))}
        className="w-full py-4 bg-emerald-500 text-black font-bold rounded-2xl hover:bg-emerald-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        <Sparkles size={20} />
        Get Recommendations
      </button>

      {loading && (
        <div className="flex flex-col items-center justify-center py-12 gap-4">
          <Loader2 className="animate-spin text-emerald-500" size={40} />
          <p className="text-zinc-400 animate-pulse">Sifting through the archives...</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {results.map((movie, i) => (
          <MovieCard key={i} movie={movie} />
        ))}
      </div>
    </div>
  );

  const renderHistory = () => (
    <div className="space-y-8 pb-24">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold text-white tracking-tight">Search History</h2>
        <p className="text-zinc-400">Revisit your past recommendations.</p>
      </div>

      {history.length === 0 ? (
        <div className="text-center py-20 bg-zinc-900/50 rounded-3xl border border-zinc-800 border-dashed">
          <HistoryIcon className="mx-auto text-zinc-700 mb-4" size={48} />
          <p className="text-zinc-500">No history yet. Start exploring!</p>
        </div>
      ) : (
        <div className="space-y-12">
          {history.map((item) => (
            <div key={item.id} className="space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                <div className="flex items-center gap-3">
                  <span className="px-2 py-1 bg-zinc-800 text-zinc-400 rounded text-[10px] uppercase font-bold tracking-widest">
                    {item.type}
                  </span>
                  <h3 className="text-white font-bold">{item.query}</h3>
                </div>
                <span className="text-xs text-zinc-500">
                  {new Date(item.timestamp).toLocaleDateString()}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {item.results.map((movie, i) => (
                  <MovieCard key={i} movie={movie} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const navItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Home' },
    { id: 'mood', icon: Smile, label: 'Mood' },
    { id: 'movie', icon: Search, label: 'Similar' },
    { id: 'genre', icon: Clapperboard, label: 'Genre' },
    { id: 'history', icon: HistoryIcon, label: 'History' },
  ];

  return (
    <div className="min-h-screen bg-black text-zinc-100 font-sans selection:bg-emerald-500 selection:text-black">
      <main className="max-w-7xl mx-auto px-6 pt-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'dashboard' && renderDashboard()}
            {activeTab === 'mood' && renderMood()}
            {activeTab === 'movie' && renderMovieSearch()}
            {activeTab === 'genre' && renderGenre()}
            {activeTab === 'history' && renderHistory()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-zinc-950/80 backdrop-blur-xl border-t border-zinc-800 px-6 py-4 z-50">
        <div className="max-w-lg mx-auto flex justify-between items-center">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as Tab)}
              className={`flex flex-col items-center gap-1 transition-colors ${
                activeTab === item.id ? 'text-emerald-500' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <item.icon size={24} strokeWidth={activeTab === item.id ? 2.5 : 2} />
              <span className="text-[10px] font-bold uppercase tracking-wider">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}
