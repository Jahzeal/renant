const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

function buildQueryString(params: Record<string, any>): string {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;

    if (Array.isArray(value)) {
      // Top-level array (e.g. key=val1&key=val2)
      value.forEach((item) => searchParams.append(key, String(item)));
    } else if (typeof value === 'object') {
      // Nested object (e.g. price[min]=10, moreOptions[keywords]=foo)
      Object.entries(value).forEach(([subKey, subValue]) => {
        if (subValue !== undefined && subValue !== null && subValue !== "") {
          if (Array.isArray(subValue)) {
             // Nested array (e.g. moreOptions[selectedPets]=cat)
             subValue.forEach((item) => {
               searchParams.append(`${key}[${subKey}]`, String(item));
             });
          } else {
             searchParams.append(`${key}[${subKey}]`, String(subValue));
          }
        }
      });
    } else {
      // Primitive
      searchParams.append(key, String(value));
    }
  });

  return searchParams.toString();
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

    console.log(`[getRentals] Fetching: ${url}`);

    const res = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error(`API error response (${res.status}):`, errorText);
      throw new Error(`Failed to fetch rentals: ${res.status} ${res.statusText}`);
    }

    return await res.json();
  } catch (error) {
    console.error("getRentals() error:", error);
    // Re-throw so the UI can catch it
    throw error;
  }
}
