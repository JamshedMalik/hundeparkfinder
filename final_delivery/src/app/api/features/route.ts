import { getFeatures } from '@/lib/data';
import { NextResponse } from 'next/server';

// API route to get all features
export async function GET() {
  const features = getFeatures();
  return NextResponse.json(features);
}
