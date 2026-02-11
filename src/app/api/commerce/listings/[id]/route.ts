import { NextRequest, NextResponse } from 'next/server';
import { transformListingResponse } from '@/lib/commerce-transformers';

const API_BASE = process.env.MOLTBOOK_API_URL || 'https://www.moltbook.com/api/v1';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const authHeader = request.headers.get('authorization');

    const response = await fetch(`${API_BASE}/commerce/listings/${id}`, {
      headers: authHeader ? { Authorization: authHeader } : {},
    });

    const backendData = await response.json();

    // Transform backend response to match frontend types
    const transformedData = transformListingResponse(backendData);

    return NextResponse.json(transformedData, { status: response.status });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
