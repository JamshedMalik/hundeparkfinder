import { NextResponse } from 'next/server';
import { getDogParks, searchParks, getParksByFeature, getCityBySlug } from '@/lib/data';
import type { DogPark } from '@/lib/types';

// API route to get all dog parks
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  
  // Get query parameters
  const query = searchParams.get('query');
  const city = searchParams.get('city');
  const feature = searchParams.get('feature');
  
  let parks: DogPark[] = [];
  
  // Handle different query scenarios
  if (query) {
    // Search by query
    parks = searchParks(query);
  } else if (city) {
    // Filter by city
    const cityData = getCityBySlug(city);
    parks = cityData?.parks || [];
  } else if (feature) {
    // Filter by feature
    parks = getParksByFeature(feature);
  } else {
    // Return all parks
    parks = getDogParks();
  }
  
  return NextResponse.json(parks);
}
