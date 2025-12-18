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
  addTourRequest: (request: Omit<TourRequest, "id" | "createdAt" | "status">) => Promise<TourRequest | null>
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

  // Fetch tour requests from database on mount (just like apply requests)
  useEffect(() => {
    getTourRequestsFromDb()
  }, [])

  // ---------------------- TOUR ----------------------
  const addTourRequest = async (
    request: Omit<TourRequest, "id" | "createdAt" | "status">,
  ): Promise<TourRequest | null> => {
    const token = getAuthToken()
    if (!token) {
      console.error("No auth token available")
      return null
    }

    try {
      const response = await apiRequest(`${API_BASE_URL}/users/tour-request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          propertyId: request.listingId,
          name: request.name,
          email: request.email,
          phone: request.phone,
          message: request.message,
        }),
      })

      if (!response || !response.ok) {
        const errText = await response?.text()
        console.error("Failed to submit tour request:", errText)
        return null
      }

      const data = await response.json()

      // Format the response from backend
      const newRequest: TourRequest = {
        id: data.id,
        listingId: data.property?.id || request.listingId,
        listingTitle: data.property?.title || request.listingTitle,
        listingPrice:
          typeof data.property?.price === "object"
            ? (data.property.price?.amount ?? request.listingPrice)
            : (data.property?.price ?? request.listingPrice),
        propertyType: data.property?.propertyType || request.propertyType,
        name: data.name,
        email: data.email,
        phone: data.phone,
        message: data.message || "",
        createdAt: data.createdAt || new Date().toISOString(),
        status: data.status || "pending",
      }

      setTourRequests((prev) => [newRequest, ...prev])
      return newRequest
    } catch (error) {
      console.error("Failed to submit tour request:", error)
      return null
    }
  }

  const getTourRequestsFromDb = useCallback(async (): Promise<TourRequest[] | null> => {
    const token = getAuthToken()
    if (!token) {
      console.warn("No auth token for tour requests")
      return null
    }

    try {
      console.log("Fetching tour requests...")

      const res = await apiRequest(`${API_BASE_URL}/users/tour-requests`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      if (!res) {
        console.error(" No response received from tour requests API")
        return null
      }

      let data: any

      if (typeof (res as any)?.json === "function") {
        const response = res as Response

        if (!response.ok) {
          const errText = await response.text()
          console.error(" Tour request failed:", response.status, errText)
          return null
        }

        data = await response.json()
      } else {
        data = res
      }

      console.log("Tour requests data:", data)

      if (!Array.isArray(data)) {
        console.error(" Expected array for tour requests, got:", data)
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

      console.log("Formatted tour requests:", formatted)

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
        console.error(" No response received from apiRequest")
        return null
      }

      let data: any

      if (typeof (res as any)?.json === "function") {
        const response = res as Response

        if (!response.ok) {
          const errText = await response.text()
          console.error(" Request failed:", response.status, errText)
          return null
        }

        data = await response.json()
      } else {
        data = res
      }

      if (!Array.isArray(data)) {
        console.error("Expected array, got:", data)
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

      console.log("Formatted data:", formatted)

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
    try {
      const token = getAuthToken()
      if (!token) {
        console.error("No auth token for delete")
        return
      }

      const res = await apiRequest(`${API_BASE_URL}/users/cancel-tours/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (res && !res.ok) {
        console.error("Failed to delete tour from backend")
        return
      }

      // Remove from local state after successful backend delete
      setTourRequests((prev) => prev.filter((req) => req.id !== id))
    } catch (err) {
      console.error("Failed to remove tour request:", err)
    }
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
