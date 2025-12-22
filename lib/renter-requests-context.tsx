"use client";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { useCallback } from "react";
import { apiRequest } from "./authenticate";

const getAuthToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("access_token");
};

export interface TourRequest {
  id: string;
  propertyId: string;
  propertyTitle: string;
  propertyPrice?: number;
  createdAt: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
}

export interface ApplyRequest {
  id: string;
  propertyId: string;
  propertyTitle: string;
  propertyPrice?: number;
  createdAt: string;
  status: "pending" | "submitted" | "approved" | "rejected";
}

interface RenterRequestsContextType {
  tourRequests: TourRequest[];
  applyRequests: ApplyRequest[];
  addTourRequest: (propertyId: string) => Promise<TourRequest | null>;
  requestToApply: (propertyId: string) => Promise<ApplyRequest | null>;
  getRequestsFromDb: () => Promise<ApplyRequest[] | null>;
  getTourRequestsFromDb: () => Promise<TourRequest[] | null>;
  updateTourRequestStatus: (id: string, status: TourRequest["status"]) => void;
  updateApplyRequestStatus: (
    id: string,
    status: ApplyRequest["status"]
  ) => void;
  // removeTourRequest: (id: string) => void
  cancelTourRequest: (propertyId: string, userId: string) => Promise<boolean>;
}

const RenterRequestsContext = createContext<
  RenterRequestsContextType | undefined
>(undefined);

export function RenterRequestsProvider({ children }: { children: ReactNode }) {
  const [tourRequests, setTourRequests] = useState<TourRequest[]>([]);
  const [applyRequests, setApplyRequests] = useState<ApplyRequest[]>([]);

  // Fetch tour requests from database on mount (just like apply requests)
  useEffect(() => {
    getTourRequestsFromDb();
  }, []);

  // ---------------------- TOUR ----------------------
  const addTourRequest = async (
    propertyId: string
  ): Promise<TourRequest | null> => {
    const token = getAuthToken();
    if (!token) return null;
    try {
      const response = await apiRequest(`${API_BASE_URL}/users/tour-request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ propertyId }),
      }).then((res) => res?.json());

      if (!response || !response.request || !response.property) return null;

      const newReq: TourRequest = {
        id: response.request.id,
        propertyId: response.property.id,
        propertyTitle: response.property.title,
        propertyPrice: response.property.price,
        createdAt: response.request.requestedAt || new Date().toISOString(),
        status: "pending",
      };
      setTourRequests((prev) => [newReq, ...prev]);
      return newReq;
    } catch (error) {
      console.error("Failed to submit tour request:", error);
      return null;
    }
  };

  const getTourRequestsFromDb = useCallback(async (): Promise<
    TourRequest[] | null
  > => {
    const token = getAuthToken();
    if (!token) {
      console.warn("No auth token");
      return null;
    }
    try {
      console.log(" Fetching tourRequests...");

      const res = await apiRequest(`${API_BASE_URL}/users/tour-requests`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res) {
        console.error(" No response received from apiRequest");
        return null;
      }
      let data: any;
      if (typeof (res as any)?.json === "function") {
        const response = res as Response;
        if (!response.ok) {
          const errText = await response.text();
          console.error(" Request failed:", response.status, errText);
          return null;
        }
        data = await response.json();
      } else {
        data = res;
      }

      if (!Array.isArray(data)) {
        console.error("Expected array, got:", data);
        return null;
      }

      const formatted = data.map((req: any) => ({
        id: req.id,
        propertyId: req.property.id,
        propertyTitle: req.property.title,
        propertyPrice:
          typeof req.property.price === "object"
            ? req.property.price?.amount ?? 0
            : req.property.price ?? 0,
        createdAt: req.createdAt || new Date().toISOString(),
        status: req.status ?? "pending",
      }));

      console.log("Formatted tour requests:", formatted);

      setTourRequests((prev) => {
        const map = new Map(prev.map((r) => [r.id, r]));
        formatted.forEach((r) => map.set(r.id, r));
        return Array.from(map.values());
      });
      return formatted;
    } catch (err) {
      console.error("fetch error:", err);
      return null;
    }
  }, []);

  // ---------------------- APPLY ----------------------
  const requestToApply = async (
    propertyId: string
  ): Promise<ApplyRequest | null> => {
    const token = getAuthToken();
    if (!token) return null;

    try {
      const response = await apiRequest(
        `${API_BASE_URL}/users/requestToApply`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ propertyId }),
        }
      ).then((res) => res?.json());

      if (!response || !response.request || !response.property) return null;

      const newReq: ApplyRequest = {
        id: response.request.id,
        propertyId: response.property.id,
        propertyTitle: response.property.title,
        propertyPrice: response.property.price,
        createdAt: response.request.requestedAt || new Date().toISOString(),
        status: "submitted",
      };

      setApplyRequests((prev) => [newReq, ...prev]);
      return newReq;
    } catch (error) {
      console.error("Failed to submit apply request:", error);
      return null;
    }
  };

  const getRequestsFromDb = useCallback(async (): Promise<
    ApplyRequest[] | null
  > => {
    const token = getAuthToken();
    if (!token) {
      console.warn("No auth token");
      return null;
    }

    try {
      console.log(" Fetching appliesRequested...");

      const res = await apiRequest(`${API_BASE_URL}/users/appliesRequested`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res) {
        console.error(" No response received from apiRequest");
        return null;
      }

      let data: any;

      if (typeof (res as any)?.json === "function") {
        const response = res as Response;

        if (!response.ok) {
          const errText = await response.text();
          console.error(" Request failed:", response.status, errText);
          return null;
        }

        data = await response.json();
      } else {
        data = res;
      }

      if (!Array.isArray(data)) {
        console.error("Expected array, got:", data);
        return null;
      }

      const formatted = data.map((req: any) => ({
        id: req.id,
        propertyId: req.property.id,
        propertyTitle: req.property.title,
        propertyPrice:
          typeof req.property.price === "object"
            ? req.property.price?.amount ?? 0
            : req.property.price ?? 0,
        createdAt: req.createdAt || new Date().toISOString(),
        status: req.status ?? "submitted",
      }));

      console.log("Formatted data:", formatted);

      setApplyRequests(formatted);
      return formatted;
    } catch (err) {
      console.error("fetch error:", err);
      return null;
    }
  }, []);

  // ---------------------- UPDATE / REMOVE ----------------------
  const updateTourRequestStatus = (
    id: string,
    status: TourRequest["status"]
  ) => {
    setTourRequests((prev) =>
      prev.map((req) => (req.id === id ? { ...req, status } : req))
    );
  };

  const updateApplyRequestStatus = (
    id: string,
    status: ApplyRequest["status"]
  ) => {
    setApplyRequests((prev) =>
      prev.map((req) => (req.id === id ? { ...req, status } : req))
    );
  };

  const cancelTourRequest = async (tourId: string, propertyId: string) => {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error("Not authenticated");
      }

      // 1. Send the request
      const res = await apiRequest(`${API_BASE_URL}/users/cancel-tours`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        // The backend 'dto' expects tourId and propertyId
        body: JSON.stringify({ tourId, propertyId }),
      });

      // 2. Error Handling
      if (!res) throw new Error("No response from server");

      // If apiRequest returns a standard Response object, check if it's OK
      if (res instanceof Response && !res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || `Error: ${res.status}`);
      }

      // 3. Update Local UI State
      // We filter by tourId because it is the unique primary key
      setTourRequests((prev) => prev.filter((req) => req.id !== tourId));

      return true;
    } catch (err) {
      console.error("Failed to cancel tour request:", err);
      throw err;
    }
  };

  return (
    <RenterRequestsContext.Provider
      value={{
        tourRequests,
        applyRequests,
        addTourRequest,
        requestToApply,
        getRequestsFromDb,
        getTourRequestsFromDb,
        updateTourRequestStatus,
        updateApplyRequestStatus,
        cancelTourRequest,
      }}
    >
      {children}
    </RenterRequestsContext.Provider>
  );
}

export function useRenterRequests() {
  const context = useContext(RenterRequestsContext);
  if (!context) {
    throw new Error(
      "useRenterRequests must be used within a RenterRequestsProvider"
    );
  }
  return context;
}
