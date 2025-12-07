"use client"
import { useState } from "react"
import { X, ChevronLeft, ChevronRight } from "lucide-react"
import { useRouter } from "next/navigation"

interface BookNowModalProps {
  isOpen: boolean
  onClose: () => void
  listingTitle: string
  listingId: string
  listingPrice?: number
  nightlyRate?: number
}

export default function BookNowModal({
  isOpen,
  onClose,
  listingTitle,
  listingId,
  listingPrice,
  nightlyRate,
}: BookNowModalProps) {
  const router = useRouter()
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [checkInDate, setCheckInDate] = useState<Date | null>(null)
  const [checkOutDate, setCheckOutDate] = useState<Date | null>(null)
  const [selectingCheckOut, setSelectingCheckOut] = useState(false)

  if (!isOpen) return null

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const handleDateClick = (day: number) => {
    const selectedDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)

    if (!checkInDate) {
      setCheckInDate(selectedDate)
      setSelectingCheckOut(true)
    } else if (!selectingCheckOut) {
      return
    } else if (!checkOutDate) {
      if (selectedDate > checkInDate) {
        setCheckOutDate(selectedDate)
        setSelectingCheckOut(false)
      } else {
        setCheckInDate(selectedDate)
        setCheckOutDate(null)
        setSelectingCheckOut(true)
      }
    }
  }

  const handleContinue = () => {
    if (checkInDate && checkOutDate) {
      const bookingData = {
        listingId,
        listingTitle,
        checkIn: checkInDate.toISOString().split("T")[0],
        checkOut: checkOutDate.toISOString().split("T")[0],
        nightlyRate: nightlyRate || listingPrice,
      }
      sessionStorage.setItem("bookingData", JSON.stringify(bookingData))
      router.push("/payment")
      onClose()
    }
  }

  const monthName = currentMonth.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  })
  const daysInMonth = getDaysInMonth(currentMonth)
  const firstDay = getFirstDayOfMonth(currentMonth)
  const days = []

  for (let i = 0; i < firstDay; i++) {
    days.push(null)
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i)
  }

  const isDateInRange = (day: number) => {
    if (!day || !checkInDate) return false
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
    if (checkOutDate) {
      return date > checkInDate && date < checkOutDate
    }
    return false
  }

  const isDateSelected = (day: number) => {
    if (!day) return false
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
    return (
      (checkInDate && date.toDateString() === checkInDate.toDateString()) ||
      (checkOutDate && date.toDateString() === checkOutDate.toDateString())
    )
  }

  const nights =
    checkInDate && checkOutDate
      ? Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24))
      : 0

  const totalPrice = nights > 0 ? nights * (nightlyRate || listingPrice || 0) : 0

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl flex flex-col max-h-[95vh]">
        <div className="sticky top-0 flex items-center justify-between p-6 border-b bg-white">
          <h2 className="text-2xl font-semibold">Book {listingTitle}</h2>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Calendar */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Select Dates</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg mb-4">
                <p className="text-center font-semibold text-lg">{monthName}</p>
              </div>

              <div className="grid grid-cols-7 gap-2 mb-4">
                {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((day) => (
                  <div key={day} className="text-center text-sm font-semibold text-gray-500">
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-2">
                {days.map((day, idx) => (
                  <button
                    key={idx}
                    onClick={() => day && handleDateClick(day)}
                    disabled={!day}
                    className={`aspect-square rounded text-sm font-medium transition-all ${
                      !day
                        ? "text-gray-300"
                        : isDateSelected(day)
                          ? "bg-blue-600 text-white"
                          : isDateInRange(day)
                            ? "bg-blue-100 text-blue-900"
                            : "hover:bg-gray-100 text-gray-900"
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>

            {/* Booking Details */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Check-in</label>
                <input
                  type="text"
                  readOnly
                  value={checkInDate ? checkInDate.toLocaleDateString() : "Select date"}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md bg-gray-50 text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Check-out</label>
                <input
                  type="text"
                  readOnly
                  value={checkOutDate ? checkOutDate.toLocaleDateString() : "Select date"}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md bg-gray-50 text-gray-900"
                />
              </div>

              {checkInDate && checkOutDate && (
                <>
                  <div className="border-t pt-4">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">
                        ${nightlyRate || listingPrice}/night × {nights} nights
                      </span>
                      <span className="font-semibold">${totalPrice}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span>${totalPrice}</span>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-2">
                      <span className="font-semibold">
                        {nights} night{nights > 1 ? "s" : ""}
                      </span>{" "}
                      in {listingTitle}
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 flex gap-3 p-6 border-t bg-white">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-md font-semibold text-gray-900 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleContinue}
            disabled={!checkInDate || !checkOutDate}
            className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue to Payment
          </button>
        </div>
      </div>
    </div>
  )
}
