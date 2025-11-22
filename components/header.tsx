"use client"
import { useState, useEffect } from "react"
import type React from "react"

import Link from "next/link"
import { Menu, X, Search } from "lucide-react"

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [searchInput, setSearchInput] = useState("")
  const [showRentDropdown, setShowRentDropdown] = useState(false)

  const navItems = [
    { label: "Rent", href: "#" },
    { label: "Sell", href: "#" },
    { label: "Get a mortgage", href: "#" },
    { label: "Find an agent", href: "#" },
  ]

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 200)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchInput.trim()) {
      window.location.href = `/rentals?location=${encodeURIComponent(searchInput)}`
    }
  }

  let dropdownTimer: NodeJS.Timeout | null = null

  const handleRentMouseEnter = () => {
    if (dropdownTimer) clearTimeout(dropdownTimer)
    setShowRentDropdown(true)
  }

  const handleRentMouseLeave = () => {
    dropdownTimer = setTimeout(() => {
      setShowRentDropdown(false)
    }, 100)
  }

  const handleDropdownMouseEnter = () => {
    if (dropdownTimer) clearTimeout(dropdownTimer)
    setShowRentDropdown(true)
  }

  const handleDropdownMouseLeave = () => {
    setShowRentDropdown(false)
  }

  return (
    <>
      <header className="border-b border-border bg-white relative z-30">
        <div className="max-w-full px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Link href="/rentals" className="text-primary font-bold text-2xl hover:opacity-80 transition-opacity">
                Z
              </Link>
              <span className="font-semibold hidden sm:inline text-lg"></span>
            </div>

            <nav className="hidden md:flex items-center gap-8 flex-1 ml-12">
              {navItems.map((item) => (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => item.label === "Rent" && handleRentMouseEnter()}
                  onMouseLeave={() => item.label === "Rent" && handleRentMouseLeave()}
                >
                  <a
                    href={item.href}
                    className="text-foreground hover:text-primary font-medium text-sm transition-colors whitespace-nowrap"
                  >
                    {item.label}
                  </a>
                </div>
              ))}
            </nav>

            {showRentDropdown && (
              <div
                className="fixed left-0 right-0 top-[60px] bg-white border-b border-border shadow-lg z-50"
                onMouseEnter={handleDropdownMouseEnter}
                onMouseLeave={handleDropdownMouseLeave}
              >
                <div className="max-w-7xl mx-auto px-8 py-12">
                  <div className="grid grid-cols-4 gap-16">
                    {/* Lyons rentals column */}
                    <div>
                      <h3 className="font-semibold text-base mb-6 text-foreground">Lyons rentals</h3>
                      <div className="space-y-4">
                        <a href="#" className="block text-sm text-primary hover:underline leading-relaxed">
                          Apartments for rent
                        </a>
                        <a href="#" className="block text-sm text-primary hover:underline leading-relaxed">
                          Houses for rent
                        </a>
                        <a href="#" className="block text-sm text-primary hover:underline leading-relaxed">
                          All rental listings
                        </a>
                        <a href="#" className="block text-sm text-primary hover:underline leading-relaxed">
                          All rental buildings
                        </a>
                      </div>
                    </div>

                    {/* Your search column */}
                    <div>
                      <h3 className="font-semibold text-base mb-6 text-foreground">Your search</h3>
                      <div className="space-y-4">
                        <a href="#" className="block text-sm text-primary hover:underline leading-relaxed">
                          Saved searches
                        </a>
                        <a href="#" className="block text-sm text-primary hover:underline leading-relaxed">
                          Inbox
                        </a>
                        <a href="#" className="block text-sm text-primary hover:underline leading-relaxed">
                          Contacted rentals
                        </a>
                        <a href="#" className="block text-sm text-primary hover:underline leading-relaxed">
                          Applications
                        </a>
                      </div>
                    </div>

                    {/* Your rental column */}
                    <div>
                      <h3 className="font-semibold text-base mb-6 text-foreground">Your rental</h3>
                      <div className="space-y-4">
                        <a href="#" className="block text-sm text-primary hover:underline leading-relaxed">
                          Overview
                        </a>
                        <a href="#" className="block text-sm text-primary hover:underline leading-relaxed">
                          Make a payment
                        </a>
                        <a href="#" className="block text-sm text-primary hover:underline leading-relaxed">
                          Your lease
                        </a>
                      </div>
                    </div>

                    {/* Resources column */}
                    <div>
                      <h3 className="font-semibold text-base mb-6 text-foreground">Resources</h3>
                      <div className="space-y-4">
                        <a href="#" className="block text-sm text-primary hover:underline leading-relaxed">
                          Rent with Zillow
                        </a>
                        <a href="#" className="block text-sm text-primary hover:underline leading-relaxed">
                          Build your credit
                        </a>
                        <a href="#" className="block text-sm text-primary hover:underline leading-relaxed">
                          Renters insurance
                        </a>
                        <a href="#" className="block text-sm text-primary hover:underline leading-relaxed">
                          Affordability calculator
                        </a>
                        <a href="#" className="block text-sm text-primary hover:underline leading-relaxed">
                          Rent Guide
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="hidden sm:flex items-center gap-4 md:gap-6">
              <button className="text-foreground hover:text-primary font-medium text-sm transition-colors">
                Manage rentals
              </button>
              <button className="text-foreground hover:text-primary font-medium text-sm transition-colors">
                Advertise
              </button>
              <button className="text-foreground hover:text-primary font-medium text-sm transition-colors">
                Get help
              </button>
              <Link href="/signin" className="text-black font-semibold text-sm hover:opacity-80 transition-opacity">
                Sign in
              </Link>
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 hover:bg-muted rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X size={24} className="text-foreground" />
              ) : (
                <Menu size={24} className="text-foreground" />
              )}
            </button>
          </div>

          <div
            className={`md:hidden transition-all duration-300 overflow-hidden ${
              mobileMenuOpen ? "max-h-[500px] opacity-100 mt-4" : "max-h-0 opacity-0"
            }`}
          >
            <div className="pb-4 border-t border-border pt-4 space-y-3">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="block text-foreground hover:text-primary font-medium text-sm py-2 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </a>
              ))}
              <hr className="border-border" />
              <button className="w-full text-left text-foreground hover:text-primary font-medium text-sm py-2 transition-colors">
                Manage rentals
              </button>
              <button className="w-full text-left text-foreground hover:text-primary font-medium text-sm py-2 transition-colors">
                Advertise
              </button>
              <button className="w-full text-left text-foreground hover:text-primary font-medium text-sm py-2 transition-colors">
                Get help
              </button>
              <Link href="/signin" className="text-black font-semibold text-sm hover:opacity-80 transition-opacity">
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div
        className={`fixed top-0 left-0 right-0 bg-white border-b border-border shadow-md z-50 transition-transform duration-300 ${
          isScrolled ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="max-w-full px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-4">
            <Link href="/rentals" className="text-primary font-bold text-xl hover:opacity-80 transition-opacity">
              Z
            </Link>

            <form onSubmit={handleSearch} className="flex-1 max-w-3xl">
              <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5">
                <input
                  type="text"
                  placeholder="Enter an address, neighborhood, city, or ZIP code"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="flex-1 bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground"
                />
                <button type="submit" className="p-1.5 hover:bg-gray-100 rounded transition-colors">
                  <Search size={18} className="text-gray-400" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}
