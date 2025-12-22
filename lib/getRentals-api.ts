const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

function buildQueryString(filters: Record<string, any>) {
  const cleanFilters = Object.fromEntries(
    Object.entries(filters).filter(([_, value]) => value !== undefined && value !== null)
  );
  return new URLSearchParams(cleanFilters).toString();
}

export async function getRentals(filters: Record<string, any> = {}) {
  try {
    if (!API_BASE_URL) {
      console.error("NEXT_PUBLIC_API_URL is not set");
      return [];
    }

    // Convert "All types" to undefined
    if (filters.propertyType === "All types") filters.propertyType = undefined;

    const queryString = buildQueryString(filters);
    const url = `${API_BASE_URL}/rentals${queryString ? `?${queryString}` : ''}`;

    const res = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });

    if (!res.ok) {
      console.error("API error response:", await res.text());
      throw new Error(`Failed to fetch rentals: ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    console.error("getRentals() error:", error);
    return [];
  }
}
