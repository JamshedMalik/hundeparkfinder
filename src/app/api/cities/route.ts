import { getCities } from '@/lib/data';
import { NextResponse } from 'next/server';

// API route to get all cities with dog parks
export async function GET() {
  const cities = getCities();
  return NextResponse.json(cities);
}
