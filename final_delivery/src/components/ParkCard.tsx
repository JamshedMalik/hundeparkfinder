'use client';

import { DogPark } from '@/lib/types';
import Link from 'next/link';
import { createSlug } from '@/lib/data';

interface ParkCardProps {
  park: DogPark;
}

export default function ParkCard({ park }: ParkCardProps) {
  const parkSlug = createSlug(park.name);
  
  // Function to determine which features to show as icons
  const getFeatureIcons = () => {
    const icons = [];
    
    if (park.is_fenced === 'yes') {
      icons.push({ icon: '🔒', label: 'Eingezäunt' });
    }
    
    if (park.has_water === 'yes') {
      icons.push({ icon: '💧', label: 'Wasser' });
    }
    
    if (park.has_agility === 'yes') {
      icons.push({ icon: '🏃‍♂️', label: 'Agility' });
    }
    
    if (park.name.toLowerCase().includes('indoor')) {
      icons.push({ icon: '🏠', label: 'Indoor' });
    }
    
    return icons;
  };
  
  const featureIcons = getFeatureIcons();
  
  return (
    <Link href={`/park/${parkSlug}`}>
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition overflow-hidden h-full flex flex-col">
        <div className="bg-green-100 h-40 flex items-center justify-center">
          {/* Placeholder for park image */}
          <div className="text-4xl">🐕</div>
        </div>
        
        <div className="p-4 flex-grow">
          <h3 className="font-bold text-lg mb-1 text-green-800">{park.name}</h3>
          <p className="text-gray-600 text-sm mb-2">{park.city}, {park.state}</p>
          
          {park.rating && (
            <div className="flex items-center mb-2">
              <span className="text-yellow-500 mr-1">★</span>
              <span className="font-medium">{park.rating}</span>
            </div>
          )}
          
          {featureIcons.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {featureIcons.map((feature, index) => (
                <span 
                  key={index} 
                  className="inline-flex items-center bg-green-50 px-2 py-1 rounded text-sm"
                  title={feature.label}
                >
                  {feature.icon}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
