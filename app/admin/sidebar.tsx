"use client";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Zap,
  LogOut,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  Sun,
  Moon,
  X,
  Upload,
  Home,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";

interface SidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activePage?: string;
}

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
  { icon: Upload, label: "Upload", href: "/admin/upload" },
  { icon: Home, label: "Rentals", href: "/admin/rentals" },
];

export default function Sidebar({
  open,
  onOpenChange,
  activePage = "/admin",
}: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const router = useRouter();
  const signOut = useAuth((state) => state.signOut);

  const handleLogout = () => {
    signOut();
    router.push("/signin");
  };

  return (
    <>
      {/* Mobile Overlay: Shorthand for clicking outside to close */}
      {open && (
        <div
          className="fixed inset-0 bg-black/20 z-40 md:hidden backdrop-blur-sm"
          onClick={() => onOpenChange(false)}
        />
      )}

      <aside
        className={cn(
          // Base styles
          "fixed md:relative z-50 h-[calc(100vh-2rem)] m-4 transition-all duration-300 ease-in-out bg-white rounded-[2rem] border border-slate-100 shadow-xl flex flex-col",
          // Desktop Width Logic
          isCollapsed ? "md:w-20" : "md:w-64",
          // Mobile Visibility Logic
          open ? "translate-x-0 w-64" : "-translate-x-[120%] md:translate-x-0"
        )}
      >
        {/* Desktop Collapse Toggle */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden md:flex absolute -right-3 top-10 bg-white border border-slate-200 rounded-full p-1 text-slate-400 hover:text-slate-600 z-50 shadow-sm"
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>

        {/* Mobile Close Button */}
        <button
          onClick={() => onOpenChange(false)}
          className="md:hidden absolute right-4 top-4 p-2 text-slate-400"
        >
          <X size={20} />
        </button>

        <div className="p-4 flex flex-col h-full">
          {/* Logo */}
          <Link href="/rentals" className="block">
            <div
              className={cn(
                "flex items-center gap-3 mb-10 mt-2 px-2 cursor-pointer",
                isCollapsed ? "md:justify-center" : ""
              )}
            >
              <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                <Zap size={22} className="text-white fill-white" />
              </div>

              {(!isCollapsed || open) && (
                <span className="text-xl font-bold text-slate-800 tracking-tight">
                  Rentant
                </span>
              )}
            </div>
          </Link>

          {/* Navigation */}
          <nav className="flex-1 space-y-2">
            {menuItems.map((item) => {
              const isActive = activePage === item.href;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => onOpenChange(false)} // Close mobile menu on click
                  className={cn(
                    "flex items-center gap-4 px-3 py-3 rounded-2xl transition-all duration-200 group",
                    isActive
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-200" // ✅ Active item is blue
                      : "text-slate-500 hover:bg-slate-50"
                  )}
                >
                  <item.icon
                    size={22}
                    className={cn(
                      "flex-shrink-0 transition-colors",
                      isActive
                        ? "text-white" // icon matches active text
                        : "text-slate-400 group-hover:text-slate-600"
                    )}
                  />
                  {(!isCollapsed || open) && (
                    <span className="text-sm font-semibold whitespace-nowrap">
                      {item.label}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Bottom Section */}
          <div className="pt-4 border-t border-slate-50 space-y-2">
            <Link
              href=""
              className="flex items-center gap-4 px-3 py-3 text-slate-500 hover:bg-slate-50 rounded-2xl transition-colors"
            >
              <HelpCircle size={22} />
              {(!isCollapsed || open) && (
                <span className="text-sm font-semibold">Help</span>
              )}
            </Link>

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-4 px-3 py-3 text-slate-500 hover:bg-slate-50 rounded-2xl transition-colors"
            >
              <LogOut size={22} />
              {(!isCollapsed || open) && (
                <span className="text-sm font-semibold">Log out</span>
              )}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
