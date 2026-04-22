'use server';

import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query) {
    return NextResponse.json(
      { error: 'Query parameter is required' },
      { status: 400 }
    );
  }

  const apiKey = process.env.NEXT_PUBLIC_LOCATIONIQ_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: 'LocationIQ API key not configured' },
      { status: 500 }
    );
  }

  try {
    const response = await fetch(
      `https://api.locationiq.com/v1/search.php?key=${apiKey}&q=${encodeURIComponent(query)}&format=json&limit=8&dedupe=1`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`LocationIQ API error: ${response.statusText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('LocationIQ API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch locations' },
      { status: 500 }
    );
  }
}
