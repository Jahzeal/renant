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
  propertyId: string
  propertyTitle: string
  propertyPrice?: number
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
  addTourRequest: (propertyId: string) => Promise<TourRequest | null>
  requestToApply: (propertyId: string) => Promise<ApplyRequest | null>
  getRequestsFromDb: () => Promise<ApplyRequest[] | null>
  getTourRequestsFromDb: () => Promise<TourRequest[] | null>
  updateTourRequestStatus: (id: string, status: TourRequest["status"]) => void
  updateApplyRequestStatus: (id: string, status: ApplyRequest["status"]) => void
  // removeTourRequest: (id: string) => void
  cancelTourRequest: (propertyId: string, userId: string) => Promise<void>
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
  const addTourRequest = async (propertyId: string): Promise<TourRequest | null> => {
    const token = getAuthToken()
    if (!token) return null
    try {
      const response = await apiRequest(`${API_BASE_URL}/users/tour-request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ propertyId }),
      }).then((res) => res?.json())

      if (!response || !response.request || !response.property) return null

      const newReq: TourRequest = {
        id: response.request.id,
        propertyId: response.property.id,
        propertyTitle: response.property.title,
        propertyPrice: response.property.price,
        createdAt: response.request.requestedAt || new Date().toISOString(),
        status: "pending",
      }
      setTourRequests((prev) => [newReq, ...prev])
      return newReq
    } catch (error) {
      console.error("Failed to submit tour request:", error)
      return null
    }
  }

  const getTourRequestsFromDb = useCallback(async (): Promise<TourRequest[] | null> => {
    const token = getAuthToken()
    if (!token) {
      console.warn("No auth token")
      return null
    }
    try {
      console.log(" Fetching tourRequests...")

      const res = await apiRequest(`${API_BASE_URL}/users/tour-requests`, {
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
        status: req.status ?? "pending",
      }))

      console.log("Formatted tour requests:", formatted)

      setTourRequests(formatted)
      return formatted
    } catch (err) {
      console.error("fetch error:", err)
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

  // const removeTourRequest = async (id: string) => {
  //   try {
  //     const token = getAuthToken()
  //     if (!token) {
  //       console.error("No auth token for delete")
  //       return
  //     }

  //     const res = await apiRequest(`${API_BASE_URL}/users/cancel-tours/${id}`, {
  //       method: "DELETE",
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     })

  //     if (res && !res.ok) {
  //       console.error("Failed to delete tour from backend")
  //       return
  //     }

  //     // Remove from local state after successful backend delete
  //     setTourRequests((prev) => prev.filter((req) => req.id !== id))
  //   } catch (err) {
  //     console.error("Failed to remove tour request:", err)
  //   }
  // }

  const cancelTourRequest = async (propertyId: string, userId: string) => {
    try {
      const token = getAuthToken()
      if (!token) {
        console.error("No auth token for cancel")
        throw new Error("Not authenticated")
      }

      const res = await apiRequest(`${API_BASE_URL}/users/cancel-tours`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ propertyId, userId }),
      })

      // Handle both Response objects and null returns
      if (!res) {
        console.error("No response from cancel tour API")
        throw new Error("No response from server")
      }

      if (typeof (res as any)?.json === "function") {
        const response = res as Response
        if (!response.ok) {
          const errText = await response.text()
          console.error("Cancel tour failed:", response.status, errText)
          throw new Error(`Failed to cancel tour: ${response.status}`)
        }
      }

      // Remove from local state after successful backend cancel
      setTourRequests((prev) => prev.filter((req) => req.propertyId !== propertyId))
    } catch (err) {
      console.error("Failed to cancel tour request:", err)
      throw err
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
        // removeTourRequest,
        cancelTourRequest,
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
