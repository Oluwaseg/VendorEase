/**
 * LocationIQ API Helper
 * Integrates with my.locationiq.com for address search and geocoding
 */

export interface LocationIQPlace {
  place_id: string;
  name: string;
  address: string;
  address_line1?: string;
  city?: string;
  state?: string;
  county?: string;
  postcode?: string;
  country?: string;
  country_code?: string;
  display_address?: string;
  lat?: string;
  lon?: string;
}

export interface LocationIQResponse {
  place_id: string;
  license: string;
  osm_type: string;
  osm_id: string;
  lat: string;
  lon: string;
  display_name: string;
  address: {
    house_number?: string;
    road?: string;
    neighbourhood?: string;
    suburb?: string;
    city?: string;
    state?: string;
    postcode?: string;
    country?: string;
    country_code?: string;
  };
  boundingbox?: [string, string, string, string];
}

/**
 * Search for addresses and locations using LocationIQ
 * @param query - The search query (e.g., "New York", "123 Main St")
 * @param limit - Maximum number of results to return (default: 10)
 * @returns Array of location results
 */
export async function searchLocations(
  query: string,
  limit: number = 10
): Promise<LocationIQResponse[]> {
  if (!query.trim()) return [];

  try {
    const params = new URLSearchParams({
      q: query,
      limit: Math.min(limit, 50).toString(),
    });

    const response = await fetch(
      `/api/locationiq/search?${params.toString()}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      console.error('LocationIQ API error:', response.status);
      return [];
    }

    const data: LocationIQResponse[] = await response.json();
    return data;
  } catch (error) {
    console.error('Error searching locations:', error);
    return [];
  }
}

/**
 * Reverse geocode to get address from coordinates
 * @param lat - Latitude
 * @param lon - Longitude
 * @returns Location details
 */
export async function reverseGeocode(
  lat: string | number,
  lon: string | number
): Promise<LocationIQResponse | null> {
  try {
    const params = new URLSearchParams({
      lat: String(lat),
      lon: String(lon),
    });

    const response = await fetch(
      `/api/locationiq/reverse?${params.toString()}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      console.error('LocationIQ reverse geocode error:', response.status);
      return null;
    }

    const data: LocationIQResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error reverse geocoding:', error);
    return null;
  }
}

/**
 * Parse LocationIQ response into address components
 */
export function parseLocationToAddress(location: LocationIQResponse) {
  const address = location.address || {};
  return {
    addressLine:
      address.road ||
      address.house_number ||
      location.display_name.split(',')[0],
    city: address.city || address.suburb || '',
    state: address.state || '',
    country: address.country || '',
    postalCode: address.postcode || '',
    lat: location.lat,
    lon: location.lon,
  };
}

/**
 * Format location for display
 */
export function formatLocationDisplay(location: LocationIQResponse): string {
  const address = location.address || {};
  const parts = [
    address.road || address.house_number || '',
    address.city || address.suburb || '',
    address.state || '',
  ].filter(Boolean);

  return parts.length > 0 ? parts.join(', ') : location.display_name;
}
