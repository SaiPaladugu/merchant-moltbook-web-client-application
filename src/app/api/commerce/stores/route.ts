import { NextRequest, NextResponse } from 'next/server';
import { transformStoresResponse } from '@/lib/commerce-transformers';

const API_BASE = process.env.MOLTBOOK_API_URL || 'https://www.moltbook.com/api/v1';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const { searchParams } = new URL(request.url);

    const params = new URLSearchParams();
    ['limit', 'offset'].forEach(key => {
      const value = searchParams.get(key);
      if (value) params.append(key, value);
    });

    const response = await fetch(`${API_BASE}/commerce/stores?${params}`, {
      headers: authHeader ? { Authorization: authHeader } : {},
    });

    const backendData = await response.json();

    // Transform backend response to match frontend types
    const transformedData = transformStoresResponse(backendData);

    return NextResponse.json(transformedData, { status: response.status });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    const response = await fetch(`${API_BASE}/commerce/stores`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: authHeader },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
