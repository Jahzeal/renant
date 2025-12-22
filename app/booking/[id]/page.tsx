"use client"
import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { ChevronLeft, ChevronRight, Calendar, MapPin } from "lucide-react"
import { getRentals } from "@/lib/getRentals-api"

interface DateRange {
  checkIn: Date | null
  checkOut: Date | null
}

interface Listing {
  id: string
  images: string[]
  title: string
  location: string
  price: number
  beds: number
  baths: number
  room_type: string
  type: string
  description?: string
}

export default function BookingPage() {
  const router = useRouter()
  const params = useParams()
  const listingId = Array.isArray(params?.id) ? params.id[0] : (params?.id as string)

  const [listing, setListing] = useState<Listing | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [dateRange, setDateRange] = useState<DateRange>({
    checkIn: null,
    checkOut: null,
  })
  const [noteToOwner, setNoteToOwner] = useState("")

  useEffect(() => {
    const fetchListing = async () => {
  try {
    setError(null)

    const res = await getRentals()
    const listings = Array.isArray(res) ? res : res.data ?? []

    if (listings.length === 0) {
      setError("No listings available. Make sure NEXT_PUBLIC_API_URL is set correctly.")
      setListing(null)
      return
    }

    const found = listings.find((l: any) => String(l.id) === String(listingId))

    if (!found) {
      setError("Listing not found")
      setListing(null)
    } else {
      setListing(found)
    }
  } catch (err) {
    console.error("Failed to fetch listing:", err)
    setError(err instanceof Error ? err.message : "Failed to load listing")
    setListing(null)
  } finally {
    setLoading(false)
  }
}

    if (listingId) {
      fetchListing()
    } else {
      setError("No listing ID provided")
      setLoading(false)
    }
  }, [listingId])

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))
  }

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))
  }

  const isPastDate = (day: number): boolean => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
    date.setHours(0, 0, 0, 0)
    return date < today
  }

  const isToday = (day: number): boolean => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
    date.setHours(0, 0, 0, 0)
    return date.getTime() === today.getTime()
  }

  const handleDateClick = (day: number) => {
    if (isPastDate(day)) return

    const clickedDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)

    if (!dateRange.checkIn) {
      setDateRange({ ...dateRange, checkIn: clickedDate })
    } else if (!dateRange.checkOut) {
      if (clickedDate > dateRange.checkIn) {
        setDateRange({ ...dateRange, checkOut: clickedDate })
      } else {
        setDateRange({ checkIn: clickedDate, checkOut: null })
      }
    } else {
      setDateRange({ checkIn: clickedDate, checkOut: null })
    }
  }

  const isDateSelected = (day: number): boolean => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
    if (dateRange.checkIn && dateRange.checkOut) {
      return date >= dateRange.checkIn && date <= dateRange.checkOut
    }
    return false
  }

  const isDateHighlighted = (day: number): boolean => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
    return date.getTime() === dateRange.checkIn?.getTime() || date.getTime() === dateRange.checkOut?.getTime()
  }

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const calculateNights = (): number => {
    if (!dateRange.checkIn || !dateRange.checkOut) return 0
    const time = dateRange.checkOut.getTime() - dateRange.checkIn.getTime()
    return Math.ceil(time / (1000 * 60 * 60 * 24))
  }

  const daysInMonth = getDaysInMonth(currentMonth)
  const firstDay = getFirstDayOfMonth(currentMonth)
  const monthName = currentMonth.toLocaleString("default", {
    month: "long",
    year: "numeric",
  })

  const days = []
  for (let i = 0; i < firstDay; i++) {
    days.push(null)
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i)
  }

  const nights = calculateNights()
  const totalPrice = nights * (listing?.price || 0)

  const handleContinue = () => {
    if (!dateRange.checkIn || !dateRange.checkOut) {
      alert("Please select both check-in and check-out dates")
      return
    }

    const queryParams = new URLSearchParams({
      checkIn: dateRange.checkIn.toISOString(),
      checkOut: dateRange.checkOut.toISOString(),
      note: noteToOwner,
      nights: nights.toString(),
      total: totalPrice.toString(),
    })

    router.push(`/booking/${listingId}/payment?${queryParams.toString()}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading listing...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <p className="text-red-500 font-semibold">Error: {error}</p>
        <button onClick={() => router.back()} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Go Back
        </button>
      </div>
    )
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">Listing not found</p>
        <button onClick={() => router.back()} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Go Back
        </button>
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
          <h1 className="text-xl sm:text-2xl font-semibold text-foreground">Book Your Stay</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          <div className="lg:col-span-2 space-y-6 sm:space-y-8">
            {/* Select Date Section */}
            <div className="bg-card rounded-xl border border-border p-4 sm:p-8">
              <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-4 sm:mb-6">Select Your Dates</h2>

              {/* Month Navigation */}
              <div className="mb-8">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mb-6">
                  <h3 className="text-base sm:text-lg font-semibold text-foreground">{monthName}</h3>
                  <div className="flex gap-2">
                    <button onClick={handlePrevMonth} className="p-2 hover:bg-muted rounded-lg transition-colors">
                      <ChevronLeft size={20} className="text-foreground" />
                    </button>
                    <button onClick={handleNextMonth} className="p-2 hover:bg-muted rounded-lg transition-colors">
                      <ChevronRight size={20} className="text-foreground" />
                    </button>
                  </div>
                </div>

                {/* Calendar Grid */}
                <div className="bg-muted/30 rounded-lg p-4 sm:p-6 overflow-x-auto">
                  <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center mb-4 min-w-max sm:min-w-full">
                    {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((day) => (
                      <div
                        key={day}
                        className="font-semibold text-foreground text-xs sm:text-sm h-10 flex items-center justify-center"
                      >
                        {day}
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-7 gap-1 sm:gap-2 min-w-max sm:min-w-full">
                    {days.map((day, index) => (
                      <button
                        key={index}
                        onClick={() => day && handleDateClick(day)}
                        disabled={!day || isPastDate(day)}
                        className={`h-10 sm:h-12 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                          !day
                            ? ""
                            : isPastDate(day)
                              ? "text-muted-foreground bg-muted/50 cursor-not-allowed opacity-50"
                              : isDateHighlighted(day)
                                ? "bg-blue-600 text-white font-semibold"
                                : isToday(day)
                                  ? "bg-green-500 text-white font-semibold ring-2 ring-green-300"
                                  : isDateSelected(day)
                                    ? "bg-blue-200 text-foreground"
                                    : "text-foreground hover:bg-muted hover:scale-105"
                        }`}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Check-in and Check-out */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6">
                <div>
                  <label className="text-xs sm:text-sm font-medium text-foreground block mb-2 sm:mb-3">Check in</label>
                  <div className="flex items-center gap-3 bg-muted/30 rounded-lg p-3 sm:p-4 border border-border">
                    <Calendar size={18} className="text-muted-foreground flex-shrink-0" />
                    <input
                      type="text"
                      value={
                        dateRange.checkIn
                          ? dateRange.checkIn.toLocaleDateString("en-US", {
                              month: "2-digit",
                              day: "2-digit",
                              year: "numeric",
                            })
                          : ""
                      }
                      readOnly
                      className="bg-transparent text-xs sm:text-sm text-foreground focus:outline-none flex-1 min-w-0"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs sm:text-sm font-medium text-foreground block mb-2 sm:mb-3">Check out</label>
                  <div className="flex items-center gap-3 bg-muted/30 rounded-lg p-3 sm:p-4 border border-border">
                    <Calendar size={18} className="text-muted-foreground flex-shrink-0" />
                    <input
                      type="text"
                      value={
                        dateRange.checkOut
                          ? dateRange.checkOut.toLocaleDateString("en-US", {
                              month: "2-digit",
                              day: "2-digit",
                              year: "numeric",
                            })
                          : ""
                      }
                      readOnly
                      className="bg-transparent text-xs sm:text-sm text-foreground focus:outline-none flex-1 min-w-0"
                    />
                  </div>
                </div>
              </div>

              {/* Note to Owner */}
              <div>
                <label className="text-xs sm:text-sm font-medium text-foreground block mb-2 sm:mb-3">
                  Note to Owner (optional)
                </label>
                <textarea
                  value={noteToOwner}
                  onChange={(e) => setNoteToOwner(e.target.value)}
                  placeholder="Add any special requests or notes for the property owner..."
                  className="w-full border border-border rounded-lg p-3 sm:p-4 text-xs sm:text-sm bg-muted/20 text-foreground placeholder-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                />
              </div>
            </div>
          </div>

          {/* Sidebar with Listing Details */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-xl border border-border p-4 sm:p-8 sticky top-24 space-y-4 sm:space-y-6">
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
                  <h3 className="text-base sm:text-lg font-semibold text-foreground text-balance">{listing.title}</h3>
                  <div className="flex items-center gap-2 text-muted-foreground mt-1 sm:mt-2">
                    <MapPin size={16} />
                    <span className="text-xs sm:text-sm">{listing.location}</span>
                  </div>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 sm:space-y-4">
                <div className="flex justify-between items-center text-sm sm:text-base">
                  <span className="text-foreground">
                    ₦{listing.price.toLocaleString()} x {nights} {nights === 1 ? "night" : "nights"}
                  </span>
                  <span className="font-semibold text-foreground">₦{totalPrice.toLocaleString()}</span>
                </div>

                <div className="border-t border-border pt-3 sm:pt-4 flex justify-between items-center">
                  <span className="font-semibold text-foreground text-sm sm:text-base">Total</span>
                  <span className="text-lg sm:text-xl font-bold text-foreground">₦{totalPrice.toLocaleString()}</span>
                </div>
              </div>

              {/* Continue Button */}
              <button
                onClick={handleContinue}
                disabled={!dateRange.checkIn || !dateRange.checkOut}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-muted disabled:cursor-not-allowed text-white font-semibold py-2 sm:py-3 px-3 sm:px-4 rounded-lg transition-colors text-sm sm:text-base"
              >
                Continue to Payment
              </button>

              {/* Info Text */}
              <p className="text-xs text-muted-foreground text-center">You won't be charged yet</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
