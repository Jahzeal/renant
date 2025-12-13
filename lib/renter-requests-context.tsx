"use client";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { useCallback } from "react";
const getAuthToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("access_token");
};

export interface TourRequest {
  id: string;
  listingId: string;
  listingTitle: string;
  listingPrice?: number;
  name: string;
  email: string;
  phone: string;
  message: string;
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
  addTourRequest: (request: Omit<TourRequest, "id" | "createdAt">) => void;
  requestToApply: (propertyId: string) => Promise<ApplyRequest | null>;
  getRequestsFromDb: () => Promise<ApplyRequest[] | null>;
  updateTourRequestStatus: (id: string, status: TourRequest["status"]) => void;
  updateApplyRequestStatus: (id: string, status: ApplyRequest["status"]) => void;
  removeTourRequest: (id: string) => void;
  removeApplyRequest: (id: string) => void;
}

const RenterRequestsContext = createContext<RenterRequestsContextType | undefined>(undefined);

export function RenterRequestsProvider({ children }: { children: ReactNode }) {
  const [tourRequests, setTourRequests] = useState<TourRequest[]>([]);
  const [applyRequests, setApplyRequests] = useState<ApplyRequest[]>([]);

  // ---------------------- TOUR ----------------------
  const addTourRequest = (request: Omit<TourRequest, "id" | "createdAt">) => {
    const newRequest: TourRequest = {
      ...request,
      id: `tour-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setTourRequests((prev) => [newRequest, ...prev]);
  };

  // ---------------------- APPLY ----------------------
  const requestToApply = async (propertyId: string): Promise<ApplyRequest | null> => {
    const token = getAuthToken();
    if (!token) return null;

    try {
      const response = await fetch(`${API_BASE_URL}/users/requestToApply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ propertyId }),
      }).then((res) => res.json());

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

  // Fetch all apply requests from DB (used by Rentals Hub)

const getRequestsFromDb = useCallback(async (): Promise<ApplyRequest[] | null> => {
  const token = getAuthToken();
  if (!token) return null;

  try {
    const res = await fetch(`${API_BASE_URL}/users/appliesRequested`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (!Array.isArray(data)) {
      console.error("Expected array, got:", data);
      return null;
    }

    const formatted = data.map((req: any) => ({
      id: req.id,
      propertyId: req.property.id,
      propertyTitle: req.property.title,
      propertyPrice: req.property.price,
      createdAt: req.createdAt,
      status: req.status ?? "submitted",
    }));

    setApplyRequests(formatted);
    console.log("RAW APPLY DATA:", data);
    return formatted;
  } catch (err) {
    console.error(err);
    return null;
  }
}, []);



  // ---------------------- UPDATE / REMOVE ----------------------
  const updateTourRequestStatus = (id: string, status: TourRequest["status"]) => {
    setTourRequests((prev) => prev.map((req) => (req.id === id ? { ...req, status } : req)));
  };

  const updateApplyRequestStatus = (id: string, status: ApplyRequest["status"]) => {
    setApplyRequests((prev) => prev.map((req) => (req.id === id ? { ...req, status } : req)));
  };

  const removeTourRequest = (id: string) => {
    setTourRequests((prev) => prev.filter((req) => req.id !== id));
  };

  const removeApplyRequest = (id: string) => {
    setApplyRequests((prev) => prev.filter((req) => req.id !== id));
  };

  return (
    <RenterRequestsContext.Provider
      value={{
        tourRequests,
        applyRequests,
        addTourRequest,
        requestToApply,
        getRequestsFromDb,
        updateTourRequestStatus,
        updateApplyRequestStatus,
        removeTourRequest,
        removeApplyRequest,
      }}
    >
      {children}
    </RenterRequestsContext.Provider>
  );
}

export function useRenterRequests() {
  const context = useContext(RenterRequestsContext);
  if (!context) {
    throw new Error("useRenterRequests must be used within a RenterRequestsProvider");
  }
  return context;
}
