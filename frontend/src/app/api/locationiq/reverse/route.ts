import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get('lat');
  const lon = searchParams.get('lon');

  if (!lat || !lon) {
    return NextResponse.json(
      { error: 'lat and lon parameters are required' },
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
      `https://api.locationiq.com/v1/reverse.php?key=${apiKey}&lat=${lat}&lon=${lon}&format=json`,
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
    console.error('LocationIQ reverse geocode error:', error);
    return NextResponse.json(
      { error: 'Failed to reverse geocode location' },
      { status: 500 }
    );
  }
}
