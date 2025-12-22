"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Menu, X, LogOut, ChevronDown } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";

export default function PageHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showRentDropdown, setShowRentDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showManageRentalsDropdown, setShowManageRentalsDropdown] =
    useState(false);

  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const manageRentalsDropdownRef = useRef<HTMLDivElement>(null);
  const dropdownTimer = useRef<NodeJS.Timeout | null>(null);

  const { user, signOut } = useAuth();
  const router = useRouter();

  const navItems = [{ label: "Rent", href: "/rentals" }];

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(target)
      ) {
        setShowProfileDropdown(false);
      }
      if (
        manageRentalsDropdownRef.current &&
        !manageRentalsDropdownRef.current.contains(target)
      ) {
        setShowManageRentalsDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  // Hover logic for the "Rent" Mega Menu
  const openRentMenu = () => {
    if (dropdownTimer.current) clearTimeout(dropdownTimer.current);
    setShowRentDropdown(true);
  };

  const closeRentMenu = () => {
    dropdownTimer.current = setTimeout(() => {
      setShowRentDropdown(false);
    }, 150);
  };

  return (
    <header className="border-b border-slate-200 bg-white sticky top-0 z-50">
      <div className="max-w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Primary Nav */}
          <div className="flex items-center gap-8">
            <Link href="/rentals" className="text-blue-900 font-black text-3xl">
              Z
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              {navItems.map((item) => (
                <div
                  key={item.label}
                  className="relative py-5"
                  onMouseEnter={openRentMenu}
                  onMouseLeave={closeRentMenu}
                >
                  <Link
                    href={item.href}
                    className="text-slate-900 hover:text-blue-900 font-medium text-sm transition-colors"
                  >
                    {item.label}
                  </Link>
                </div>
              ))}
            </nav>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-6">
              {/* Manage Rentals Dropdown */}
              <div className="relative" ref={manageRentalsDropdownRef}>
                <button
                  onClick={() =>
                    setShowManageRentalsDropdown(!showManageRentalsDropdown)
                  }
                  className="flex items-center gap-1 text-slate-700 hover:text-blue-900 font-medium text-sm transition-colors"
                >
                  Manage rentals
                  <ChevronDown size={14} />
                </button>

                {showManageRentalsDropdown && (
                  <div className="absolute right-0 mt-3 w-64 bg-white border border-slate-200 rounded-xl shadow-xl p-5 animate-in fade-in zoom-in-95 duration-100">
                    <h3 className="font-bold text-slate-900 mb-3">
                      Rental Manager
                    </h3>
                    <div className="space-y-3">
                      <Link
                        href="/renter-hub"
                        className="block text-sm text-slate-600 hover:text-blue-600"
                      >
                        Applications
                      </Link>
                      <Link
                        href="#"
                        className="block text-sm text-slate-600 hover:text-blue-600"
                      >
                        Messages
                      </Link>
                      <hr className="border-slate-100" />
                      <Link
                        href="#"
                        className="block text-sm text-slate-600 hover:text-blue-600"
                      >
                        Help Center
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              <Link
                href="#"
                className="text-slate-700 hover:text-blue-900 font-medium text-sm"
              >
                Get help
              </Link>

              {user ? (
                <div className="relative" ref={profileDropdownRef}>
                  <button
                    onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                    className="flex items-center"
                  >
                    <img
                      src={user.profileImage || "/placeholder.svg"}
                      alt="Profile"
                      className="w-9 h-9 rounded-full border border-slate-200 hover:ring-2 hover:ring-blue-100 transition-all"
                    />
                  </button>

                  {showProfileDropdown && (
                    <div className="absolute right-0 mt-3 w-56 bg-white border border-slate-200 rounded-xl shadow-xl py-2 animate-in fade-in zoom-in-95 duration-100">
                      <Link
                        href="/saved-homes"
                        className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                      >
                        Saved homes
                      </Link>
                      <Link
                        href="/manage-tours"
                        className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                      >
                        Manage Tours
                      </Link>
                      <Link
                        href="/renter-hub"
                        className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                      >
                        Renter Hub
                      </Link>
                      <hr className="my-2 border-slate-100" />
                      <Link
                        href="/account-settings"
                        className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                      >
                        Settings
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                      >
                        <LogOut size={16} /> Sign out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/signin"
                  className="text-blue-600 font-bold text-sm hover:text-blue-700"
                >
                  Sign in
                </Link>
              )}
            </div>

            {/* Mobile Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* RENT MEGA MENU (Desktop) */}
      {showRentDropdown && (
        <div
          className="hidden md:block absolute left-0 right-0 top-full bg-white border-b border-slate-200 shadow-2xl animate-in slide-in-from-top-2 duration-200"
          onMouseEnter={openRentMenu}
          onMouseLeave={closeRentMenu}
        >
          <div className="max-w-7xl mx-auto px-8 py-10 grid grid-cols-3 gap-12">
            <div>
              <h3 className="font-bold text-slate-900 mb-4 uppercase text-xs tracking-wider">
                Discover Rentals
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/rentals"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Apartments for rent
                  </Link>
                </li>
                <li>
                  <Link
                    href="/rentals"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Houses for rent
                  </Link>
                </li>
                <li>
                  <Link
                    href="/rentals"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    All rental listings
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-slate-900 mb-4 uppercase text-xs tracking-wider">
                Your Search
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="#"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Saved searches
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Contacted rentals
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-slate-900 mb-4 uppercase text-xs tracking-wider">
                Resources
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="#"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Renter Hub
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Lease Agreements
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* MOBILE MENU OVERLAY */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[100] bg-white md:hidden flex flex-col animate-in slide-in-from-right duration-300">
          <div className="flex items-center justify-between px-6 h-16 border-b">
            <span className="text-blue-600 font-black text-2xl">Z</span>
            <button onClick={() => setMobileMenuOpen(false)} className="p-2">
              <X size={28} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            <nav className="space-y-6">
              <Link
                href="/rentals"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-2xl font-bold text-slate-900"
              >
                Rent
              </Link>
              <Link
                href="/manage-rentals"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-2xl font-bold text-slate-900"
              >
                Manage rentals
              </Link>
              <Link
                href="#"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-2xl font-bold text-slate-900"
              >
                Get help
              </Link>
            </nav>

            <hr className="border-slate-100" />

            <div className="space-y-6">
              {user ? (
                <>
                  <Link
                    href="/saved-homes"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-lg text-slate-600"
                  >
                    Saved homes
                  </Link>
                  <Link
                    href="/renter-hub"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-lg text-slate-600"
                  >
                    Renter Hub
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="text-lg text-red-600 font-medium"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <Link
                  href="/signin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-xl font-bold text-blue-600"
                >
                  Sign in
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
