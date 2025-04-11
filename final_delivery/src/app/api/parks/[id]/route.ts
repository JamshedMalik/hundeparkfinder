import { getDogParkById } from '@/lib/data';
import { NextResponse } from 'next/server';

// API route to get a specific dog park by ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id);
  
  if (isNaN(id)) {
    return NextResponse.json(
      { error: 'Invalid ID format' },
      { status: 400 }
    );
  }
  
  const park = getDogParkById(id);
  
  if (!park) {
    return NextResponse.json(
      { error: 'Dog park not found' },
      { status: 404 }
    );
  }
  
  return NextResponse.json(park);
}
