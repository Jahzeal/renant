"use client"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL
import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useCallback } from "react"
import { apiRequest } from "./authenticate"

const getAuthToken = () => {
  if (typeof window === "undefined") return null
  return localStorage.getItem("access_token")
}

export interface TourRequest {
  id: string
  listingId: string
  listingTitle: string
  listingPrice?: number
  name: string
  propertyType?: "apartment" | "hostel" | "shortlet"
  email: string
  phone: string
  message: string
  createdAt: string
  status: "pending" | "confirmed" | "completed" | "cancelled"
}

export interface ApplyRequest {
  id: string
  propertyId: string
  propertyTitle: string
  propertyPrice?: number
  createdAt: string
  status: "pending" | "submitted" | "approved" | "rejected"
}

interface RenterRequestsContextType {
  tourRequests: TourRequest[]
  applyRequests: ApplyRequest[]
  addTourRequest: (request: Omit<TourRequest, "id" | "createdAt">) => void
  requestToApply: (propertyId: string) => Promise<ApplyRequest | null>
  getRequestsFromDb: () => Promise<ApplyRequest[] | null>
  getTourRequestsFromDb: () => Promise<TourRequest[] | null>
  updateTourRequestStatus: (id: string, status: TourRequest["status"]) => void
  updateApplyRequestStatus: (id: string, status: ApplyRequest["status"]) => void
  removeTourRequest: (id: string) => void
}

const RenterRequestsContext = createContext<RenterRequestsContextType | undefined>(undefined)

export function RenterRequestsProvider({ children }: { children: ReactNode }) {
  const [tourRequests, setTourRequests] = useState<TourRequest[]>([])
  const [applyRequests, setApplyRequests] = useState<ApplyRequest[]>([])

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("renter_tour_requests")
      if (stored) {
        try {
          const parsed = JSON.parse(stored)
          setTourRequests(parsed)
        } catch (err) {
          console.error("Failed to parse tour requests from localStorage:", err)
        }
      }
    }
  }, [])

  useEffect(() => {
    if (typeof window !== "undefined" && tourRequests.length >= 0) {
      localStorage.setItem("renter_tour_requests", JSON.stringify(tourRequests))
    }
  }, [tourRequests])

  // ---------------------- TOUR ----------------------
  const addTourRequest = (request: Omit<TourRequest, "id" | "createdAt">) => {
    const newRequest: TourRequest = {
      ...request,
      id: `tour-${Date.now()}`,
      createdAt: new Date().toISOString(),
    }
    setTourRequests((prev) => [newRequest, ...prev])
  }

  const getTourRequestsFromDb = useCallback(async (): Promise<TourRequest[] | null> => {
    const token = getAuthToken()
    if (!token) {
      console.warn("No auth token for tour requests")
      return null
    }

    try {
      console.log("📅 Fetching tour requests...")

      const res = await apiRequest(`${API_BASE_URL}/users/tours`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      if (!res) {
        console.error("❌ No response received from tour requests API")
        return null
      }

      let data: any

      if (typeof (res as any)?.json === "function") {
        const response = res as Response

        if (!response.ok) {
          const errText = await response.text()
          console.error("❌ Tour request failed:", response.status, errText)
          return null
        }

        data = await response.json()
      } else {
        data = res
      }

      console.log("🟢 Tour requests data:", data)

      if (!Array.isArray(data)) {
        console.error("❌ Expected array for tour requests, got:", data)
        return null
      }

      const formatted: TourRequest[] = data.map((req: any) => ({
        id: req.id,
        listingId: req.property?.id || req.listingId,
        listingTitle: req.property?.title || req.listingTitle,
        listingPrice:
          typeof req.property?.price === "object"
            ? (req.property.price?.amount ?? 0)
            : (req.property?.price ?? req.listingPrice ?? 0),
        propertyType: req.property?.propertyType || req.propertyType,
        name: req.name,
        email: req.email,
        phone: req.phone,
        message: req.message || "",
        createdAt: req.createdAt || new Date().toISOString(),
        status: req.status ?? "pending",
      }))

      console.log("✅ Formatted tour requests:", formatted)

      setTourRequests(formatted)
      return formatted
    } catch (err) {
      console.error("Tour fetch error:", err)
      return null
    }
  }, [])

  // ---------------------- APPLY ----------------------
  const requestToApply = async (propertyId: string): Promise<ApplyRequest | null> => {
    const token = getAuthToken()
    if (!token) return null

    try {
      const response = await apiRequest(`${API_BASE_URL}/users/requestToApply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ propertyId }),
      }).then((res) => res?.json())

      if (!response || !response.request || !response.property) return null

      const newReq: ApplyRequest = {
        id: response.request.id,
        propertyId: response.property.id,
        propertyTitle: response.property.title,
        propertyPrice: response.property.price,
        createdAt: response.request.requestedAt || new Date().toISOString(),
        status: "submitted",
      }

      setApplyRequests((prev) => [newReq, ...prev])
      return newReq
    } catch (error) {
      console.error("Failed to submit apply request:", error)
      return null
    }
  }

  const getRequestsFromDb = useCallback(async (): Promise<ApplyRequest[] | null> => {
    const token = getAuthToken()
    if (!token) {
      console.warn("No auth token")
      return null
    }

    try {
      console.log(" Fetching appliesRequested...")

      const res = await apiRequest(`${API_BASE_URL}/users/appliesRequested`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      if (!res) {
        console.error("❌ No response received from apiRequest")
        return null
      }

      let data: any

      if (typeof (res as any)?.json === "function") {
        const response = res as Response

        if (!response.ok) {
          const errText = await response.text()
          console.error("❌ Request failed:", response.status, errText)
          return null
        }

        data = await response.json()
      } else {
        data = res
      }

      if (!Array.isArray(data)) {
        console.error("❌ Expected array, got:", data)
        return null
      }

      const formatted = data.map((req: any) => ({
        id: req.id,
        propertyId: req.property.id,
        propertyTitle: req.property.title,
        propertyPrice:
          typeof req.property.price === "object" ? (req.property.price?.amount ?? 0) : (req.property.price ?? 0),
        createdAt: req.createdAt || new Date().toISOString(),
        status: req.status ?? "submitted",
      }))

      console.log("✅ Formatted data:", formatted)

      setApplyRequests(formatted)
      return formatted
    } catch (err) {
      console.error("fetch error:", err)
      return null
    }
  }, [])

  // ---------------------- UPDATE / REMOVE ----------------------
  const updateTourRequestStatus = (id: string, status: TourRequest["status"]) => {
    setTourRequests((prev) => prev.map((req) => (req.id === id ? { ...req, status } : req)))
  }

  const updateApplyRequestStatus = (id: string, status: ApplyRequest["status"]) => {
    setApplyRequests((prev) => prev.map((req) => (req.id === id ? { ...req, status } : req)))
  }

  const removeTourRequest = async (id: string) => {
    // First, try to delete from backend if it exists there
    try {
      const token = getAuthToken()
      if (token && !id.startsWith("tour-")) {
        // Only call backend if this is a backend-generated ID (not a local one)
        const res = await apiRequest(`${API_BASE_URL}/users/cancel-tours/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (res && !res.ok) {
          console.warn("Failed to delete tour from backend, but will remove from local state")
        }
      }
    } catch (err) {
      console.warn("Backend delete failed, but will remove from local state:", err)
    }

    // Always remove from local state regardless of backend result
    setTourRequests((prev) => prev.filter((req) => req.id !== id))
  }

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
        removeTourRequest,
      }}
    >
      {children}
    </RenterRequestsContext.Provider>
  )
}

export function useRenterRequests() {
  const context = useContext(RenterRequestsContext)
  if (!context) {
    throw new Error("useRenterRequests must be used within a RenterRequestsProvider")
  }
  return context
}
