'use client';

import { useEffect, useState } from 'react';
import { DogPark } from '@/lib/types';
import ParkCard from '@/components/ParkCard';
import MapComponent from '@/components/MapComponent';
import SearchBar from '@/components/SearchBar';

export default function SearchPage({
  searchParams,
}: {
  searchParams: { query?: string; city?: string; feature?: string };
}) {
  const [parks, setParks] = useState<DogPark[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

  const { query, city, feature } = searchParams;
  const searchTitle = query 
    ? `Suchergebnisse für "${query}"` 
    : city 
      ? `Hundeparks in ${city}` 
      : feature 
        ? `Hundeparks mit ${feature}` 
        : 'Alle Hundeparks';

  useEffect(() => {
    async function fetchParks() {
      setLoading(true);
      try {
        // Construct API URL with query parameters
        let url = '/api/parks';
        const params = new URLSearchParams();
        
        if (query) params.append('query', query);
        if (city) params.append('city', city);
        if (feature) params.append('feature', feature);
        
        if (params.toString()) {
          url += `?${params.toString()}`;
        }
        
        const response = await fetch(url);
        const data = await response.json();
        setParks(data);
      } catch (error) {
        console.error('Error fetching parks:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchParks();
  }, [query, city, feature]);

  return (
    <main className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6">{searchTitle}</h1>
        
        {/* Search Bar */}
        <div className="mb-8">
          <SearchBar />
        </div>
        
        {/* View Toggle */}
        <div className="flex justify-end mb-4">
          <div className="inline-flex rounded-md shadow-sm" role="group">
            <button
              type="button"
              className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
                viewMode === 'list'
                  ? 'bg-green-700 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => setViewMode('list')}
            >
              Liste
            </button>
            <button
              type="button"
              className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
                viewMode === 'map'
                  ? 'bg-green-700 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => setViewMode('map')}
            >
              Karte
            </button>
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-xl text-gray-600">Lade Hundeparks...</div>
          </div>
        ) : parks.length === 0 ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
            <h2 className="text-xl font-medium text-yellow-800 mb-2">Keine Hundeparks gefunden</h2>
            <p className="text-yellow-700">
              Versuche es mit anderen Suchbegriffen oder schau dir alle verfügbaren Hundeparks an.
            </p>
          </div>
        ) : viewMode === 'list' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {parks.map(park => (
              <ParkCard key={park.id} park={park} />
            ))}
          </div>
        ) : (
          <div className="h-[600px] rounded-lg overflow-hidden shadow-lg">
            <MapComponent parks={parks} zoom={7} />
          </div>
        )}
      </div>
    </main>
  );
}
