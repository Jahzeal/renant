"use client"

import type React from "react"

import { useState } from "react"
import { X } from "lucide-react"
import { useRouter } from "next/navigation"
import { useRenterRequests } from "@/lib/renter-requests-context"

interface RequestTourModalProps {
  isOpen: boolean
  onClose: () => void
  listingTitle: string
  listingId: string
  propertyType: "apartment" | "hostel" | "shortlet"

  listingPrice?: number
}

export function RequestTourModal({
  isOpen,
  onClose,
  listingTitle,
  listingId,
  listingPrice,
  propertyType,
}: RequestTourModalProps) {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "I'm interested in your property and would like to move forward. Can you show me around ?",
  })
  const { addTourRequest } = useRenterRequests()

  if (!isOpen) return null

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    addTourRequest({
      listingId,
      listingTitle,
      listingPrice,
      propertyType,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      message: formData.message,
    })

    onClose()
    router.push("/manage-tours")
    // Reset form
    setFormData({
      name: "",
      email: "",
      phone: "",
      message: "I'm interested in your property and would like to move forward. Can you show me around ?",
    })
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl h-[95vh] flex flex-col">
        <div className="sticky top-0 flex items-center justify-between p-6 border-b bg-white">
          <h2 className="text-2xl font-semibold">Request a tour</h2>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-6">
          <div>
            <label className="text-base font-semibold text-gray-900">
              First & last name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full mt-2 px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-base font-semibold text-gray-900">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full mt-2 px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
              />
            </div>
            <div>
              <label className="text-base font-semibold text-gray-900">
                Phone <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter Phone Number"
                required
                className="w-full mt-2 px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
              />
            </div>
          </div>

          <div>
            <label className="text-base font-semibold text-gray-900">Message</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={8}
              className="w-full mt-2 px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 resize-none"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-md transition-colors text-lg"
          >
            Send tour request
          </button>
        </form>
      </div>
    </div>
  )
}
