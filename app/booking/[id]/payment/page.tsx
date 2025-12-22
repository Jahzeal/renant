"use client"
import { useState, useEffect } from "react"
import type React from "react"

import { useRouter, useParams, useSearchParams } from "next/navigation"
import { ChevronLeft, MapPin, Loader2 } from "lucide-react"
import { getRentals } from "@/lib/getRentals-api"

interface Listing {
  id: string
  images: string[]
  title: string
  location: string
  price: number
}

export default function PaymentPage() {
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()
  const listingId = params.id as string

  const [listing, setListing] = useState<Listing | null>(null)
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)

  const checkIn = searchParams.get("checkIn") ? new Date(searchParams.get("checkIn")!) : null
  const checkOut = searchParams.get("checkOut") ? new Date(searchParams.get("checkOut")!) : null
  const note = searchParams.get("note") || ""
  const nights = Number(searchParams.get("nights")) || 0
  const total = Number(searchParams.get("total")) || 0

 useEffect(() => {
  const fetchListing = async () => {
    try {
      const res = await getRentals()
      const listings = Array.isArray(res) ? res : res.data ?? []

      const found = listings.find((l: any) => String(l.id) === String(listingId))

      // console.log("Payment page - Looking for listing ID:", listingId)
      // console.log("Payment page - Found listing:", found)

      setListing(found || null)
    } catch (error) {
      console.error("Failed to fetch listing:", error)
      setListing(null)
    } finally {
      setLoading(false)
    }
  }

  fetchListing()
}, [listingId])

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\s/g, "")
    value = value.replace(/(\d{4})/g, "$1 ").trim()
    setFormData((prev) => ({
      ...prev,
      cardNumber: value,
    }))
  }

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "")
    if (value.length >= 2) {
      value = value.slice(0, 2) + "/" + value.slice(2, 4)
    }
    setFormData((prev) => ({
      ...prev,
      expiryDate: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.fullName || !formData.email || !formData.phone) {
      alert("Please fill in all required fields")
      return
    }

    if (!formData.cardNumber || formData.cardNumber.replace(/\s/g, "").length !== 16) {
      alert("Please enter a valid card number")
      return
    }

    if (!formData.expiryDate || formData.expiryDate.length !== 5) {
      alert("Please enter a valid expiry date (MM/YY)")
      return
    }

    if (!formData.cvv || formData.cvv.length !== 3) {
      alert("Please enter a valid CVV")
      return
    }

    setProcessing(true)

    try {
      // In a real app, you would send this to your payment processor
      // For now, we simulate a successful payment
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Redirect to success page or confirmation
      alert("Payment successful! Your booking has been confirmed.")
      router.push("/")
    } catch (error) {
      alert("Payment failed. Please try again.")
    } finally {
      setProcessing(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Listing not found</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-4">
          <button onClick={() => router.back()} className="p-2 hover:bg-muted rounded-lg transition-colors">
            <ChevronLeft size={24} className="text-foreground" />
          </button>
          <h1 className="text-xl sm:text-2xl font-semibold text-foreground">Payment</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Payment Form */}
          <div className="lg:col-span-2">
            <div className="bg-card rounded-xl border border-border p-4 sm:p-8">
              <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-6">Payment Details</h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-4">Personal Information</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs sm:text-sm font-medium text-foreground block mb-2">Full Name *</label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder="John Doe"
                        className="w-full border border-border rounded-lg p-3 sm:p-4 text-xs sm:text-sm bg-muted/20 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-xs sm:text-sm font-medium text-foreground block mb-2">Email *</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="john@example.com"
                        className="w-full border border-border rounded-lg p-3 sm:p-4 text-xs sm:text-sm bg-muted/20 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-xs sm:text-sm font-medium text-foreground block mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+234 800 000 0000"
                        className="w-full border border-border rounded-lg p-3 sm:p-4 text-xs sm:text-sm bg-muted/20 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Card Details */}
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-4">Card Details</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs sm:text-sm font-medium text-foreground block mb-2">Card Number *</label>
                      <input
                        type="text"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleCardNumberChange}
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                        className="w-full border border-border rounded-lg p-3 sm:p-4 text-xs sm:text-sm bg-muted/20 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs sm:text-sm font-medium text-foreground block mb-2">
                          Expiry Date *
                        </label>
                        <input
                          type="text"
                          name="expiryDate"
                          value={formData.expiryDate}
                          onChange={handleExpiryChange}
                          placeholder="MM/YY"
                          maxLength={5}
                          className="w-full border border-border rounded-lg p-3 sm:p-4 text-xs sm:text-sm bg-muted/20 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-xs sm:text-sm font-medium text-foreground block mb-2">CVV *</label>
                        <input
                          type="text"
                          name="cvv"
                          value={formData.cvv}
                          onChange={handleInputChange}
                          placeholder="123"
                          maxLength={3}
                          className="w-full border border-border rounded-lg p-3 sm:p-4 text-xs sm:text-sm bg-muted/20 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={processing}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-muted disabled:cursor-not-allowed text-white font-semibold py-2 sm:py-3 px-3 sm:px-4 rounded-lg transition-colors text-sm sm:text-base flex items-center justify-center gap-2"
                >
                  {processing && <Loader2 size={18} className="animate-spin" />}
                  {processing ? "Processing..." : "Complete Payment"}
                </button>
              </form>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-xl border border-border p-4 sm:p-8 sticky top-24 space-y-4 sm:space-y-6">
              <h3 className="text-base sm:text-lg font-semibold text-foreground">Order Summary</h3>

              <div className="space-y-3 sm:space-y-4 pb-4 sm:pb-6 border-b border-border">
                {listing.images && listing.images.length > 0 && (
                  <div className="relative w-full h-40 sm:h-48 rounded-lg overflow-hidden bg-muted">
                    <img
                      src={listing.images[0] || "/placeholder.svg"}
                      alt={listing.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div>
                  <h4 className="text-sm sm:text-base font-semibold text-foreground text-balance">{listing.title}</h4>
                  <div className="flex items-center gap-2 text-muted-foreground mt-1 sm:mt-2">
                    <MapPin size={16} />
                    <span className="text-xs sm:text-sm">{listing.location}</span>
                  </div>
                </div>
              </div>

              {/* Dates */}
              <div className="space-y-2 pb-4 sm:pb-6 border-b border-border">
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-muted-foreground">Check-in</span>
                  <span className="font-medium text-foreground">
                    {checkIn?.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-muted-foreground">Check-out</span>
                  <span className="font-medium text-foreground">
                    {checkOut?.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 sm:space-y-4">
                <div className="flex justify-between items-center text-xs sm:text-sm">
                  <span className="text-foreground">
                    ₦{listing.price.toLocaleString()} x {nights} {nights === 1 ? "night" : "nights"}
                  </span>
                  <span className="font-semibold text-foreground">₦{total.toLocaleString()}</span>
                </div>

                <div className="border-t border-border pt-3 sm:pt-4 flex justify-between items-center">
                  <span className="font-semibold text-foreground text-sm sm:text-base">Total</span>
                  <span className="text-lg sm:text-xl font-bold text-blue-600">₦{total.toLocaleString()}</span>
                </div>
              </div>

              {/* Note if any */}
              {note && (
                <div className="pt-4 sm:pt-6 border-t border-border">
                  <p className="text-xs sm:text-sm font-medium text-foreground mb-2">Note to Owner</p>
                  <p className="text-xs sm:text-sm text-muted-foreground italic">{note}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
