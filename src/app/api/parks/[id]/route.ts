import { getDogParkById } from '@/lib/data';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import type { NextApiRequestContext } from 'next';

export async function GET(
  request: NextRequest,
  context: NextApiRequestContext
) {
  const id = parseInt(context.params.id);

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
