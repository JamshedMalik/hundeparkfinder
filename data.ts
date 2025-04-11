import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import { DogPark, City, Feature } from './types';

// Function to read and parse the CSV file
export function getDogParks(): DogPark[] {
  try {
    const filePath = path.join(process.cwd(), 'public', 'data', 'hundewiesen_germany.csv');
    const fileContent = fs.readFileSync(filePath, 'utf8');
    
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true
    });
    
    return records.map((record: any) => ({
      id: parseInt(record.id),
      name: record.name,
      address: record.address,
      postal_code: record.postal_code,
      city: record.city,
      state: record.state,
      latitude: record.latitude,
      longitude: record.longitude,
      google_maps_url: record.google_maps_url,
      phone: record.phone,
      opening_hours: record.opening_hours,
      website: record.website,
      description: record.description,
      is_fenced: record.is_fenced,
      has_water: record.has_water,
      has_agility: record.has_agility,
      has_seating: record.has_seating,
      has_waste_bins: record.has_waste_bins,
      has_lighting: record.has_lighting,
      has_parking: record.has_parking,
      photos: record.photos,
      rating: record.rating,
      reviews: record.reviews,
      size: record.size,
      last_updated: record.last_updated,
      data_source: record.data_source
    }));
  } catch (error) {
    console.error('Error reading dog parks data:', error);
    return [];
  }
}

// Function to get all cities with dog parks
export function getCities(): City[] {
  const parks = getDogParks();
  
  // Get unique cities
  const uniqueCities = Array.from(new Set(parks.map(park => park.city)));
  
  // Create city objects with associated parks
  return uniqueCities.map((cityName, index) => {
    const cityParks = parks.filter(park => park.city === cityName);
    const state = cityParks[0]?.state || '';
    
    return {
      id: index + 1,
      name: cityName,
      slug: cityName.toLowerCase().replace(/\s+/g, '-').replace(/[äöüß]/g, match => {
        return { 'ä': 'ae', 'ö': 'oe', 'ü': 'ue', 'ß': 'ss' }[match] || match;
      }),
      state,
      parks: cityParks
    };
  });
}

// Function to get a specific city by slug
export function getCityBySlug(slug: string): City | undefined {
  const cities = getCities();
  return cities.find(city => city.slug === slug);
}

// Function to get a specific dog park by ID
export function getDogParkById(id: number): DogPark | undefined {
  const parks = getDogParks();
  return parks.find(park => park.id === id);
}

// Function to get a specific dog park by slug
export function getDogParkBySlug(slug: string): DogPark | undefined {
  const parks = getDogParks();
  return parks.find(park => createSlug(park.name) === slug);
}

// Function to create a slug from a string
export function createSlug(text: string): string {
  return text.toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[äöüß]/g, match => {
      return { 'ä': 'ae', 'ö': 'oe', 'ü': 'ue', 'ß': 'ss' }[match] || match;
    })
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

// Function to get all features
export function getFeatures(): Feature[] {
  return [
    { id: 1, name: 'Eingezäunt', name_en: 'Fenced', slug: 'eingezaeunt', icon: 'fence' },
    { id: 2, name: 'Wasser', name_en: 'Water', slug: 'wasser', icon: 'water' },
    { id: 3, name: 'Agility', name_en: 'Agility', slug: 'agility', icon: 'agility' },
    { id: 4, name: 'Indoor', name_en: 'Indoor', slug: 'indoor', icon: 'indoor' },
    { id: 5, name: 'Sitzgelegenheiten', name_en: 'Seating', slug: 'sitzgelegenheiten', icon: 'bench' },
    { id: 6, name: 'Mülleimer', name_en: 'Waste Bins', slug: 'muelleimer', icon: 'trash' },
    { id: 7, name: 'Beleuchtung', name_en: 'Lighting', slug: 'beleuchtung', icon: 'light' },
    { id: 8, name: 'Parkplätze', name_en: 'Parking', slug: 'parkplaetze', icon: 'parking' }
  ];
}

// Function to get parks by feature
export function getParksByFeature(featureSlug: string): DogPark[] {
  const parks = getDogParks();
  const features = getFeatures();
  const feature = features.find(f => f.slug === featureSlug);
  
  if (!feature) return [];
  
  switch (feature.slug) {
    case 'eingezaeunt':
      return parks.filter(park => park.is_fenced === 'yes');
    case 'wasser':
      return parks.filter(park => park.has_water === 'yes');
    case 'agility':
      return parks.filter(park => park.has_agility === 'yes');
    case 'indoor':
      return parks.filter(park => park.name.toLowerCase().includes('indoor'));
    case 'sitzgelegenheiten':
      return parks.filter(park => park.has_seating === 'yes');
    case 'muelleimer':
      return parks.filter(park => park.has_waste_bins === 'yes');
    case 'beleuchtung':
      return parks.filter(park => park.has_lighting === 'yes');
    case 'parkplaetze':
      return parks.filter(park => park.has_parking === 'yes');
    default:
      return [];
  }
}

// Function to search parks
export function searchParks(query: string): DogPark[] {
  const parks = getDogParks();
  const searchTerms = query.toLowerCase().split(' ');
  
  return parks.filter(park => {
    const parkText = `${park.name} ${park.city} ${park.address} ${park.description}`.toLowerCase();
    return searchTerms.every(term => parkText.includes(term));
  });
}
