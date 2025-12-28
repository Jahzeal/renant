"use client";
import { useState, useEffect, useRef } from "react";
import type React from "react";

import Link from "next/link";
import { Menu, X, Search, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { usePathname } from "next/navigation";

import { useRouter } from "next/navigation";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [showRentDropdown, setShowRentDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showManageRentalsDropdown, setShowManageRentalsDropdown] =
    useState(false);
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const manageRentalsDropdownRef = useRef<HTMLDivElement>(null);
  const { user, signOut } = useAuth();
  const router = useRouter();

  const navItems = [{ label: "Rent", href: "#" }];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 200);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(e.target as Node)
      ) {
        setShowProfileDropdown(false);
      }
      if (
        manageRentalsDropdownRef.current &&
        !manageRentalsDropdownRef.current.contains(e.target as Node)
      ) {
        setShowManageRentalsDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      window.location.href = `/rentals?location=${encodeURIComponent(
        searchInput
      )}`;
    }
  };

  const handleSignOut = () => {
    signOut();
    router.push("/");
  };

  let dropdownTimer: NodeJS.Timeout | null = null;

  const handleRentMouseEnter = () => {
    if (dropdownTimer) clearTimeout(dropdownTimer);
    setShowRentDropdown(true);
  };

  const handleRentMouseLeave = () => {
    dropdownTimer = setTimeout(() => {
      setShowRentDropdown(false);
    }, 100);
  };

  const handleDropdownMouseEnter = () => {
    if (dropdownTimer) clearTimeout(dropdownTimer);
    setShowRentDropdown(true);
  };

  const handleDropdownMouseLeave = () => {
    setShowRentDropdown(false);
  };
  const pathname = usePathname();
  const logoHref = pathname.startsWith("/rentals") ? "/" : "/rentals";

  // Check if we are on the rentals page
  const isRentalsPage = pathname.startsWith("/rentals");

  return (
    <>
      <header className="border-b border-border bg-white relative z-30">
        <div className="max-w-full px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Link href={logoHref} aria-label="Home">
                <span className="text-primary font-bold text-2xl hover:opacity-80 transition-opacity">
                  Z
                </span>
              </Link>

              <span className="font-semibold hidden sm:inline text-lg"></span>
            </div>

            <nav className="hidden md:flex items-center gap-8 flex-1 ml-12">
              {navItems.map((item) => (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() =>
                    item.label === "Rent" && handleRentMouseEnter()
                  }
                  onMouseLeave={() =>
                    item.label === "Rent" && handleRentMouseLeave()
                  }
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
                    <div>
                      <h3 className="font-semibold text-base mb-6 text-foreground">
                        Lyons rentals
                      </h3>
                      <div className="space-y-4">
                        <a
                          href="/rentals"
                          className="block text-sm text-primary hover:underline leading-relaxed"
                        >
                          Apartments for rent
                        </a>
                        <a
                          href="/rentals"
                          className="block text-sm text-primary hover:underline leading-relaxed"
                        >
                          Houses for rent
                        </a>
                        <a
                          href="/rentals"
                          className="block text-sm text-primary hover:underline leading-relaxed"
                        >
                          All rental listings
                        </a>
                        <a
                          href="/rentals"
                          className="block text-sm text-primary hover:underline leading-relaxed"
                        >
                          All rental buildings
                        </a>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold text-base mb-6 text-foreground">
                        Your search
                      </h3>
                      <div className="space-y-4">
                        <a
                          href="#"
                          className="block text-sm text-primary hover:underline leading-relaxed"
                        >
                          Saved searches
                        </a>
                        <a
                          href="#"
                          className="block text-sm text-primary hover:underline leading-relaxed"
                        >
                          Inbox
                        </a>
                        <a
                          href="#"
                          className="block text-sm text-primary hover:underline leading-relaxed"
                        >
                          Contacted rentals
                        </a>
                        <a
                          href="#"
                          className="block text-sm text-primary hover:underline leading-relaxed"
                        >
                          Applications
                        </a>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold text-base mb-6 text-foreground">
                        Your rental
                      </h3>
                      <div className="space-y-4">
                        <a
                          href="#"
                          className="block text-sm text-primary hover:underline leading-relaxed"
                        >
                          Overview
                        </a>
                        <a
                          href="#"
                          className="block text-sm text-primary hover:underline leading-relaxed"
                        >
                          Make a payment
                        </a>
                        <a
                          href="#"
                          className="block text-sm text-primary hover:underline leading-relaxed"
                        >
                          Your lease
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="hidden md:flex items-center gap-4 md:gap-6">
              <div className="relative" ref={manageRentalsDropdownRef}>
                <button
                  onClick={() => setShowManageRentalsDropdown((prev) => !prev)}
                  className="text-foreground hover:text-primary font-medium text-sm transition-colors whitespace-nowrap"
                >
                  Rental Enscroll
                </button>

                {/* Fully Responsive Dropdown - Works on Phones Too */}
                {showManageRentalsDropdown && (
                  <>
                    {/* Backdrop for mobile */}
                    <div
                      className="fixed inset-0 bg-black/20 z-40 md:hidden"
                      onClick={() => setShowManageRentalsDropdown(false)}
                    />

                    <div
                      className={`
          fixed md:absolute 
          top-16 md:top-full md:mt-2 
          left-4 right-4 md:left-auto md:right-0 
          w-auto md:w-72 
          bg-white border border-border rounded-lg shadow-2xl 
          p-6 z-50 
          max-h-[calc(100vh-140px)] overflow-y-auto
          animate-in fade-in zoom-in-95 duration-200
        `}
                      style={{
                        maxWidth: "calc(100vw - 2rem)",
                        minWidth: "280px",
                      }}
                    >
                      <div className="space-y-6">
                        <div>
                          <h3 className="font-semibold text-base mb-4 text-foreground">
                            Enscroll Management
                          </h3>
                          <div className="space-y-3">
                            <a
                              href="/how-it-works"
                              className="block text-sm text-primary hover:underline"
                            >
                              How Enscroll works
                            </a>
                            <a
                              href="/buyer"
                              className="block text-sm text-primary hover:underline"
                            >
                              Buyer
                            </a>
                            <a
                              href="#"
                              className="block text-sm text-primary hover:underline"
                            >
                              Seller
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>

              <button className="text-foreground hover:text-primary font-medium text-sm transition-colors whitespace-nowrap">
                Get help
              </button>

              {user ? (
                <div className="flex items-center gap-4">
                  <div className="relative" ref={profileDropdownRef}>
                    <img
                      src={user.profileImage || "/placeholder.svg"}
                      alt={user.firstName}
                      className="w-8 h-8 rounded-full border-2 border-primary hover:border-primary/80 transition-colors cursor-pointer"
                      title={user.firstName}
                      onClick={() =>
                        setShowProfileDropdown(!showProfileDropdown)
                      }
                    />

                    {showProfileDropdown && (
                      <div className="absolute right-0 mt-2 w-64 bg-white border border-border rounded-lg shadow-lg p-6 z-50">
                        <div className="space-y-4">
                          <a
                            href="/saved-homes"
                            className="block text-sm text-foreground hover:text-primary font-medium"
                          >
                            Saved homes
                          </a>

                          <a
                            href="/manage-tours"
                            className="block text-sm text-foreground hover:text-primary font-medium"
                          >
                            Manage tours
                          </a>

                          <a
                            href="/renter-hub"
                            className="block text-sm text-foreground hover:text-primary font-medium"
                          >
                            Renter Hub
                          </a>

                          <hr className="border-border my-2" />

                          <a
                            href="/account-settings"
                            className="block text-sm text-foreground hover:text-primary font-medium"
                          >
                            Account settings
                          </a>

                          <hr className="border-border my-2" />

                          <button
                            onClick={handleSignOut}
                            className="w-full text-left text-sm text-foreground hover:text-primary font-medium flex items-center gap-2"
                          >
                            <LogOut size={16} />
                            Sign out
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <Link
                  href="/signin"
                  className="text-black font-semibold text-sm hover:opacity-80 transition-opacity"
                >
                  Sign in
                </Link>
              )}
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

          {/* === MOBILE MENU (no backdrop, fully clickable) === */}
          <div
            className={`fixed md:hidden left-0 right-0 top-[60px] transition-all duration-300 overflow-hidden bg-white z-50 ${
              mobileMenuOpen
                ? "h-[calc(100vh-60px)] opacity-100"
                : "h-0 opacity-0"
            }`}
          >
            <div className="px-4 sm:px-6 py-4 space-y-3 overflow-y-auto h-full">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="block text-foreground hover:text-primary font-medium text-sm py-2 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}

              <hr className="border-border" />

              {/* Rental Enscroll in mobile menu */}
              {/* Rental Enscroll in mobile menu */}
              <div className="w-full py-2">
                <button
                  onClick={() => setShowManageRentalsDropdown((prev) => !prev)}
                  className="w-full text-left text-foreground hover:text-primary font-medium text-base py-3 transition-colors flex items-center justify-between"
                >
                  <span>Rental Enscroll</span>
                  <svg
                    className={`w-5 h-5 transition-transform duration-200 ${
                      showManageRentalsDropdown ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {/* Dropdown items - animate slide down */}
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    showManageRentalsDropdown
                      ? "max-h-64 opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="pl-6 pt-2 pb-4 space-y-3 border-l-2 border-gray-200">
                    <Link
                      href="/how-it-works"
                      className="block text-sm text-primary hover:underline py-2"
                      onClick={() => {
                        setShowManageRentalsDropdown(false);
                        setMobileMenuOpen(false);
                      }}
                    >
                      How Enscroll works
                    </Link>

                    <Link
                      href="/buyer"
                      className="block text-sm text-primary hover:underline py-2"
                      onClick={() => {
                        setShowManageRentalsDropdown(false);
                        setMobileMenuOpen(false);
                      }}
                    >
                      Buyer
                    </Link>

                    <Link
                      href="/seller"
                      className="block text-sm text-primary hover:underline py-2"
                      onClick={() => {
                        setShowManageRentalsDropdown(false);
                        setMobileMenuOpen(false);
                      }}
                    >
                      Seller
                    </Link>
                  </div>
                </div>
              </div>

              {/* Get help */}
              <Link
                href="/help"
                className="block text-foreground hover:text-primary font-medium text-sm py-2 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Get help
              </Link>

              <hr className="border-border" />

              {/* Auth */}
              {user ? (
                <>
                  <Link
                    href="/saved-homes"
                    className="block text-foreground hover:text-primary font-medium text-sm py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Saved homes
                  </Link>
                  <Link
                    href="/manage-tours"
                    className="block text-foreground hover:text-primary font-medium text-sm py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Manage Tours
                  </Link>
                  <Link
                    href="/renter-hub"
                    className="block text-foreground hover:text-primary font-medium text-sm py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Renter Hub
                  </Link>

                  <Link
                    href="/account-settings"
                    className="block text-foreground hover:text-primary font-medium text-sm py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Account settings
                  </Link>
                  <Link
                    href="/how-it-works"
                    className="block text-foreground hover:text-primary font-medium text-sm py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    How it works
                  </Link>
                  <hr className="border-border my-2" />

                  <button
                    onClick={() => {
                      handleSignOut();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-left text-foreground hover:text-primary font-medium text-sm py-2 transition-colors flex items-center gap-2"
                  >
                    <LogOut size={16} />
                    Sign out
                  </button>
                </>
              ) : (
                <Link
                  href="/signin"
                  className="block text-black font-semibold text-sm hover:opacity-80 transition-opacity py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign in
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      <div
        className={`fixed top-0 left-0 right-0 bg-white border-b border-border shadow-md z-50 transition-transform duration-300 ${
          isScrolled && !isRentalsPage
            ? "translate-y-0"
            : "-translate-y-full"
        }`}
      >
        <div className="max-w-full px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-4">
            <Link
              href="/rentals"
              className="text-primary font-bold text-xl hover:opacity-80 transition-opacity"
            >
              Z
            </Link>

            <form onSubmit={handleSearch} className="flex-1 max-w-3xl">
              <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5">
                <input
                  type="text"
                  placeholder="Enter an address, neighborhood, city, or ZIP code"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  suppressHydrationWarning
                  className="flex-1 bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground"
                />
                <button
                  type="submit"
                  className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                >
                  <Search size={18} className="text-gray-400" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
