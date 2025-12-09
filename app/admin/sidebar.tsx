"use client";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Zap,
  Upload,
  MapPin,
  TrendingUp,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import Link from "next/link";

interface SidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activePage?: string;
}

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
  { icon: Upload, label: "Upload Properties", href: "/admin/upload" },
];

export default function Sidebar({
  open,
  onOpenChange,
  activePage = "/",
}: SidebarProps) {
  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => onOpenChange(!open)}
        className="md:hidden fixed top-4 left-4 z-40 p-2 bg-blue-600 text-white rounded-lg"
      >
        {open ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed md:relative md:w-64 w-64 h-screen bg-blue-900 text-white transition-transform duration-300 z-30 md:z-0",
          open ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="p-6">
          {/* Logo */}
          <div className="mb-8 mt-8 md:mt-0">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Zap size={20} />
              </div>
              <h1 className="text-xl font-bold">Admin</h1>
            </div>
          </div>

          {/* Navigation */}
          <nav className="space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                  activePage === item.href
                    ? "bg-blue-600 text-white"
                    : "text-slate-300 hover:bg-blue-800"
                )}
                onClick={() => onOpenChange(false)}
              >
                <item.icon size={20} />
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>

        {/* Logout button */}
        <div className="absolute bottom-6 left-6 right-6">
          <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-300 hover:text-white hover:bg-blue-800 rounded-lg transition-colors text-sm font-medium">
            <Link href="/signin">
              <LogOut size={20}/><span>Logout</span>
            </Link>
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 md:hidden z-20"
          onClick={() => onOpenChange(false)}
        />
      )}
    </>
  );
}
