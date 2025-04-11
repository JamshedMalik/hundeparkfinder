import { getCityBySlug } from '@/lib/data';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import type { NextApiRequestContext } from 'next';

export async function GET(
  request: NextRequest,
  context: NextApiRequestContext
) {
  const slug = context.params.slug;

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
