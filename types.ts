// Types for the dog park data
export interface DogPark {
  id: number;
  name: string;
  address: string;
  postal_code: string;
  city: string;
  state: string;
  latitude: string;
  longitude: string;
  google_maps_url: string;
  phone: string;
  opening_hours: string;
  website: string;
  description: string;
  is_fenced: string;
  has_water: string;
  has_agility: string;
  has_seating: string;
  has_waste_bins: string;
  has_lighting: string;
  has_parking: string;
  photos: string;
  rating: string;
  reviews: string;
  size: string;
  last_updated: string;
  data_source: string;
}

// Types for the city data
export interface City {
  id: number;
  name: string;
  slug: string;
  state: string;
  parks: DogPark[];
}

// Types for the feature data
export interface Feature {
  id: number;
  name: string;
  name_en: string;
  slug: string;
  icon?: string;
}

// Types for the blog post data
export interface BlogPost {
  id: number;
  title: string;
  title_en: string;
  slug: string;
  slug_en: string;
  content: string;
  content_en: string;
  excerpt: string;
  excerpt_en: string;
  featured_image: string;
  author: string;
  category: string;
  published_at: string;
  tags: string[];
}

// Types for search parameters
export interface SearchParams {
  city?: string;
  feature?: string;
  query?: string;
  fenced?: boolean;
  water?: boolean;
  agility?: boolean;
}
