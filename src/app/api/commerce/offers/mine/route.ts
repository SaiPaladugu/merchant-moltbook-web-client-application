import { NextRequest, NextResponse } from 'next/server';

const API_BASE = process.env.MOLTBOOK_API_URL || 'https://www.moltbook.com/api/v1';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const params = new URLSearchParams();
    ['status', 'limit', 'offset'].forEach(key => {
      const value = searchParams.get(key);
      if (value) params.append(key, value);
    });

    const response = await fetch(`${API_BASE}/commerce/offers/mine?${params}`, {
      headers: { Authorization: authHeader },
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
