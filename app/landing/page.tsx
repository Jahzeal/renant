"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Search, Clock, MapPin } from "lucide-react"
import Header from "@/components/header"
import { useAuth } from "@/hooks/use-auth"
import { useSearchHistory, type SearchHistory } from "@/lib/search-history-contsxt"

interface Property {
  id: string
  image: string
  price: number
  beds: number
  baths: number
  sqft: number
  status: string
  address: string
  badge?: string
  location: string
  type: string
}

export default function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isDropdownFocused, setIsDropdownFocused] = useState(false)
  const [searchInput, setSearchInput] = useState("")
  const [noMatchFound, setNoMatchFound] = useState(false)
  const [showSearchDropdown, setShowSearchDropdown] = useState(false)
  const [continueSearchProperties, setContinueSearchProperties] = useState<Property[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [isGettingLocation, setIsGettingLocation] = useState(false)
  const { user } = useAuth()
  const { searchHistory, addSearch } = useSearchHistory()

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 100)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Add your search logic here
  }

  const handleCurrentLocation = () => {
    // Add your current location logic here
  }

  const handleContinueSearch = (search: SearchHistory) => {
    // Add your continue search logic here
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="w-full bg-white sticky top-0 z-50 shadow-sm">
        <Header />
      </div>

      {/* Hero Section */}
      <section className="relative w-full h-screen max-h-[600px] sm:max-h-[700px] md:max-h-[800px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-no-repeat"
          style={{
            backgroundImage: "url(/buying.jpg)",
            backgroundPosition: "50% 5%",
          }}
        />
        <div className="absolute inset-0 bg-black/25" />

        <div className="relative z-10 h-full flex flex-col justify-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto w-full">
            <div className="max-w-3xl">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 text-balance leading-tight">
                Rentals. Agents. Loans. Homes.
              </h1>

              <form
                onSubmit={handleSearch}
                className={`transition-all duration-300 relative z-50 ${
                  isScrolled && !isDropdownFocused ? "opacity-0 pointer-events-none" : "opacity-100"
                }`}
              >
                <div className="w-full max-w-xl">
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                    <div className="flex-1 flex items-center gap-2 bg-white rounded-lg px-3 sm:px-4 py-3 sm:py-3.5 shadow-lg hover:shadow-xl transition-shadow relative">
                      <input
                        type="text"
                        placeholder="Enter address, neighborhood, city, or ZIP"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        onFocus={() => {
                          setShowSearchDropdown(true)
                          setIsDropdownFocused(true)
                        }}
                        onBlur={() => {
                          setTimeout(() => {
                            setShowSearchDropdown(false)
                            setIsDropdownFocused(false)
                          }, 200)
                        }}
                        className="flex-1 bg-transparent outline-none text-sm sm:text-base text-foreground placeholder:text-muted-foreground"
                        suppressHydrationWarning
                      />
                      <button
                        type="submit"
                        className="p-2 hover:bg-gray-100 rounded flex-shrink-0 transition-colors"
                        aria-label="Search"
                      >
                        <Search size={20} className="text-gray-400" />
                      </button>
                    </div>
                  </div>

                  {/* Search Dropdown */}
                  {showSearchDropdown && (
                    <div className="absolute left-0 right-0 sm:left-0 sm:right-auto sm:w-full sm:max-w-xl top-full mt-2 bg-white rounded-lg shadow-xl z-40 overflow-hidden">
                      <div
                        onClick={handleCurrentLocation}
                        className="flex items-center gap-3 p-3 sm:p-4 border-b hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <MapPin size={18} className="text-gray-600 flex-shrink-0" />
                        <span className="text-sm sm:text-base text-foreground truncate">
                          {isGettingLocation ? "Getting location..." : "Current Location"}
                        </span>
                      </div>
                      {searchHistory.length > 0 && (
                        <>
                          <div className="px-3 sm:px-4 pt-3 pb-2">
                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                              Search History
                            </p>
                          </div>
                          {searchHistory.slice(0, 2).map((search) => (
                            <div
                              key={search.id}
                              onClick={() => handleContinueSearch(search)}
                              className="flex items-center gap-3 p-3 sm:p-4 border-b hover:bg-gray-50 cursor-pointer transition-colors"
                            >
                              <Clock size={16} className="text-gray-600 flex-shrink-0" />
                              <span className="text-sm sm:text-base text-foreground truncate">{search.location}</span>
                            </div>
                          ))}
                        </>
                      )}
                    </div>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
