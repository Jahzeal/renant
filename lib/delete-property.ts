const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
import { apiRequest } from "@/lib/authenticate";

const getAuthToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("access_token");
};

export const deleteProperty = async (id: string): Promise<boolean> => {
  try {
    const token = getAuthToken();
    if (!token) {
      console.error("No auth token for delete");
      return false;
    }

    const res = await apiRequest(`${API_BASE_URL}/admin/deleteProperty/${id}`, {
      method: "DELETE", // DELETE method for removal
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res) {
      console.error("No response from delete property API");
      return false;
    }

    if (!res.ok) {
      const errText = await res.text();
      console.error("Delete property failed:", res.status, errText);
      return false;
    }

    return true; // deletion successful
  } catch (err) {
    console.error("Failed to delete property:", err);
    return false;
  }
};
