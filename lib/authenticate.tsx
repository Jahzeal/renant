// src/lib/api-client.ts

export async function apiRequest(
  url: string,
  options: RequestInit = {}
): Promise<Response | null> {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
      ...(options.headers || {}),
    },
  });
  // If Not Authorized → redirect instantly
  if (res.status === 401) {
    // Token expired or invalid → force logout
    localStorage.removeItem("access_token");
    window.location.href = "/signin"; // Redirect to sign-in page
    return null; // ✅ explicit
  }

  return res;
}
