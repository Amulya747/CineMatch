export interface Movie {
  title: string;
  year: string;
  genre: string[];
  description: string;
  rating: string;
  posterUrl?: string;
  language: string;
  country: string;
  streamingPlatforms?: string[];
}

export interface HistoryItem {
  id: number;
  type: 'mood' | 'movie' | 'genre';
  query: string;
  results: Movie[];
  timestamp: string;
}

export const GENRES = [
  "Action", "Adventure", "Animation", "Comedy", "Crime", "Documentary", 
  "Drama", "Family", "Fantasy", "History", "Horror", "Music", 
  "Mystery", "Romance", "Science Fiction", "Thriller", "War", "Western"
];

export const MOODS = [
  { label: "Happy", icon: "😊", prompt: "uplifting, feel-good, cheerful" },
  { label: "Sad", icon: "😢", prompt: "emotional, tear-jerker, melancholic" },
  { label: "Excited", icon: "🤩", prompt: "thrilling, high-energy, fast-paced" },
  { label: "Relaxed", icon: "😌", prompt: "calm, peaceful, slow-burn" },
  { label: "Scared", icon: "😨", prompt: "terrifying, suspenseful, spooky" },
  { label: "Thoughtful", icon: "🤔", prompt: "philosophical, complex, mind-bending" }
];
