'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import { DogPark } from '@/lib/types';
import { createSlug } from '@/lib/data';
import 'leaflet/dist/leaflet.css';

interface MapComponentProps {
  parks: DogPark[];
  center?: [number, number];
  zoom?: number;
}

export default function MapComponent({ 
  parks, 
  center = [51.1657, 10.4515], // Germany center
  zoom = 6 
}: MapComponentProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    // Load Leaflet only on client side
    if (typeof window !== 'undefined' && mapRef.current && !mapInstanceRef.current) {
      // Initialize map
      const map = L.map(mapRef.current).setView(center, zoom);
      mapInstanceRef.current = map;

      // Add OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      // Create marker cluster group if many markers
      const markers = L.layerGroup().addTo(map);

      // Add markers for each park
      parks.forEach(park => {
        if (park.latitude && park.longitude) {
          try {
            const lat = parseFloat(park.latitude);
            const lng = parseFloat(park.longitude);
            
            if (!isNaN(lat) && !isNaN(lng)) {
              const marker = L.marker([lat, lng])
                .addTo(markers)
                .bindPopup(`
                  <strong>${park.name}</strong><br>
                  ${park.city}, ${park.state}<br>
                  <a href="/park/${createSlug(park.name)}">Details anzeigen</a>
                `);
            }
          } catch (error) {
            console.error(`Error adding marker for park ${park.id}:`, error);
          }
        }
      });
    }

    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [parks, center, zoom]);

  return (
    <div ref={mapRef} className="w-full h-full" />
  );
}
