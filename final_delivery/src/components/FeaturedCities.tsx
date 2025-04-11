'use client';

import { City } from '@/lib/types';
import Link from 'next/link';

interface FeaturedCitiesProps {
  cities: City[];
}

export default function FeaturedCities({ cities }: FeaturedCitiesProps) {
  // Sort cities by number of parks (descending)
  const sortedCities = [...cities].sort((a, b) => b.parks.length - a.parks.length);
  
  // Take top 8 cities
  const featuredCities = sortedCities.slice(0, 8);
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {featuredCities.map(city => (
        <Link 
          key={city.id} 
          href={`/stadt/${city.slug}`}
          className="bg-white rounded-lg shadow-md hover:shadow-lg transition overflow-hidden"
        >
          <div className="p-4 text-center">
            <h3 className="font-bold text-lg mb-1">{city.name}</h3>
            <p className="text-gray-600 text-sm">{city.parks.length} Hundeparks</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
