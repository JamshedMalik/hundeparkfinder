'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/suche?query=${encodeURIComponent(query)}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="w-full max-w-2xl mx-auto">
      <div className="flex rounded-lg overflow-hidden shadow-lg">
        <input
          type="text"
          placeholder="Hundepark, Stadt oder PLZ eingeben..."
          className="flex-grow px-4 py-3 text-gray-800 focus:outline-none"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 transition"
        >
          Suchen
        </button>
      </div>
    </form>
  );
}
