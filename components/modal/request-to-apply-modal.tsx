"use client"

import type React from "react"

import { useState } from "react"
import { X, CheckCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { useRenterRequests } from "@/lib/renter-requests-context"

interface RequestToApplyModalProps {
  isOpen: boolean
  onClose: () => void
  listingTitle: string
  listingId: string
  listingPrice?: number
  agent?: {
    name: string
    company: string
    phone: string
  }
}

export function RequestToApplyModal({
  isOpen,
  onClose,
  listingTitle,
  listingId,
  listingPrice,
  agent,
}: RequestToApplyModalProps) {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message:
      "I'm interested in your property and would like to move forward. Can you send me an application for this property?",
  })
  const { addApplyRequest } = useRenterRequests()

  if (!isOpen) return null

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    addApplyRequest({
      listingId,
      listingTitle,
      listingPrice,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      message: formData.message,
      status: "pending",
    })
    onClose()
    router.push("/renter-hub")
    // Reset form
    setFormData({
      name: "",
      email: "",
      phone: "",
      message:
        "I'm interested in your property and would like to move forward. Can you send me an application for this property?",
    })
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl h-[95vh] flex flex-col">
        <div className="sticky top-0 flex items-center justify-between p-6 border-b bg-white">
          <h2 className="text-2xl font-semibold">Request to apply</h2>
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

          {agent && (
            <div className="border-t pt-6">
              <h3 className="text-base font-semibold text-gray-900 mb-4">Contact person</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <CheckCircle size={18} className="text-green-500" />
                  <span className="text-base text-gray-900">{agent.name}</span>
                </div>
                <p className="text-base text-gray-600">{agent.company}</p>
                <p className="text-base text-gray-600">{agent.phone}</p>
              </div>
            </div>
          )}

          <div className="text-sm text-gray-500">
            By contacting this property, you agree to our{" "}
            <a href="#" className="underline hover:text-gray-700">
              Terms of use
            </a>
            .
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-md transition-colors text-lg"
          >
            Send request
          </button>
        </form>
      </div>
    </div>
  )
}
