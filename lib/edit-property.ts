const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
import { apiRequest } from "@/lib/authenticate";

export type Property = any;

const getAuthToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("access_token");
};
export const editProperty = async (
  id: string,
  updatedData: Partial<Property>
): Promise<Property | null> => {
  try {
    const token = getAuthToken();
    if (!token) {
      console.error("No auth token for edit");
      return null;
    }

    // Clean undefined/null fields
    const cleanData: any = {};
    Object.keys(updatedData).forEach((key) => {
      if (updatedData[key] !== undefined && updatedData[key] !== null) {
        cleanData[key] = updatedData[key];
      }
    });

    const res = await apiRequest(`${API_BASE_URL}/admin/editProperty/${id}`, {
      method: "PATCH", // <-- must be PATCH
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(cleanData),
    });

    if (!res) {
      console.error("No response from edit property API");
      return null;
    }

    if (!res.ok) {
      const errText = await res.text();
      console.error("Edit property failed:", res.status, errText);
      return null;
    }

    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Failed to edit property:", err);
    return null;
  }
};
