"use client"

import { useState } from "react"
import { Menu, X } from "lucide-react"

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navItems = [
    { label: "Buy", href: "#" },
    { label: "Rent", href: "#" },
    { label: "Sell", href: "#" },
    { label: "Get a mortgage", href: "#" },
    { label: "Find an agent", href: "#" },
  ]

  return (
    <header className="border-b border-border bg-white sticky top-0 z-40">
      <div className="max-w-full px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="text-primary font-bold text-2xl">Z</div>
            <span className="font-semibold text-lg hidden sm:inline"></span>
          </div>

          {/* Navigation - Hidden on mobile */}
          <nav className="hidden md:flex items-center gap-8 flex-1 ml-12">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-foreground hover:text-primary font-medium text-sm transition-colors"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Right side menu - Desktop */}
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
            <button className="text-primary font-semibold text-sm hover:opacity-80 transition-opacity">Sign in</button>
          </div>

          {/* Mobile menu button */}
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

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-border pt-4 space-y-3">
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
            <button className="w-full text-left text-primary font-semibold text-sm py-2 hover:opacity-80 transition-opacity">
              Sign in
            </button>
          </div>
        )}
      </div>
    </header>
  )
}
