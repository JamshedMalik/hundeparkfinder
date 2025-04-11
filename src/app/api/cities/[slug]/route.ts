import { getCityBySlug } from '@/lib/data';
import { NextResponse } from 'next/server';

// API route to get a specific city by slug
export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const slug = params.slug;
  
  if (!slug) {
    return NextResponse.json(
      { error: 'City slug is required' },
      { status: 400 }
    );
  }
  
  const city = getCityBySlug(slug);
  
  if (!city) {
    return NextResponse.json(
      { error: 'City not found' },
      { status: 404 }
    );
  }
  
  return NextResponse.json(city);
}
