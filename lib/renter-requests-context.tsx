"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { ApplyResponse } from "@/lib/renter-request-api"   // <-- make sure this path is correct

export interface TourRequest {
  id: string
  listingId: string
  listingTitle: string
  listingPrice?: number
  name: string
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
  addApplyRequest: (response: ApplyResponse) => void
  updateTourRequestStatus: (id: string, status: TourRequest["status"]) => void
  updateApplyRequestStatus: (id: string, status: ApplyRequest["status"]) => void
  removeTourRequest: (id: string) => void
  removeApplyRequest: (id: string) => void
}

const RenterRequestsContext = createContext<RenterRequestsContextType | undefined>(undefined)

export function RenterRequestsProvider({ children }: { children: ReactNode }) {
  const [tourRequests, setTourRequests] = useState<TourRequest[]>([])
  const [applyRequests, setApplyRequests] = useState<ApplyRequest[]>([])
  const [isHydrated, setIsHydrated] = useState(false)

  // Load from localStorage
  useEffect(() => {
    try {
      const savedTourRequests = localStorage.getItem("tourRequests")
      const savedApplyRequests = localStorage.getItem("applyRequests")

      if (savedTourRequests) {
        setTourRequests(JSON.parse(savedTourRequests))
      }
      if (savedApplyRequests) {
        setApplyRequests(JSON.parse(savedApplyRequests))
      }
    } catch (error) {
      console.error("Failed to load renter requests:", error)
    }
    setIsHydrated(true)
  }, [])

  // Save to localStorage when requests change
  useEffect(() => {
    if (isHydrated) {
      try {
        localStorage.setItem("tourRequests", JSON.stringify(tourRequests))
        localStorage.setItem("applyRequests", JSON.stringify(applyRequests))
      } catch (error) {
        console.error("Failed to save renter requests:", error)
      }
    }
  }, [tourRequests, applyRequests, isHydrated])

  // ---------------------- TOUR (UNTTOUCHED) ----------------------
  const addTourRequest = (request: Omit<TourRequest, "id" | "createdAt">) => {
    const newRequest: TourRequest = {
      ...request,
      id: `tour-${Date.now()}`,
      createdAt: new Date().toISOString(),
    }
    setTourRequests((prev) => [newRequest, ...prev])
  }

  // ---------------------- APPLY (UPDATED) ----------------------
  const addApplyRequest = (response: ApplyResponse) => {
    const newReq: ApplyRequest = {
      id: response.request.id,
      propertyId: response.property.id,
      propertyTitle: response.property.title,
      propertyPrice: response.property.price,
      createdAt: response.request.requestedAt,
      status: "submitted",
    }

    setApplyRequests((prev) => [newReq, ...prev])
  }

  const updateTourRequestStatus = (id: string, status: TourRequest["status"]) => {
    setTourRequests((prev) => prev.map((req) => (req.id === id ? { ...req, status } : req)))
  }

  const updateApplyRequestStatus = (id: string, status: ApplyRequest["status"]) => {
    setApplyRequests((prev) => prev.map((req) => (req.id === id ? { ...req, status } : req)))
  }

  const removeTourRequest = (id: string) => {
    setTourRequests((prev) => prev.filter((req) => req.id !== id))
  }

  const removeApplyRequest = (id: string) => {
    setApplyRequests((prev) => prev.filter((req) => req.id !== id))
  }

  return (
    <RenterRequestsContext.Provider
      value={{
        tourRequests,
        applyRequests,
        addTourRequest,
        addApplyRequest,
        updateTourRequestStatus,
        updateApplyRequestStatus,
        removeTourRequest,
        removeApplyRequest,
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
