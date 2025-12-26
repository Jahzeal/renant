"use client";

import { useState } from "react";
import Sidebar from "../sidebar";
import { Menu } from "lucide-react";
import AdminRentals from "./allListings";

export default function AdminRenatls() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    // Updated background to a soft color so the white floating sidebar stands out
    <div className="flex h-screen bg-[#F8F9FD]">
      {/* Mobile Header Toggle */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 flex items-center px-6 bg-white/80 backdrop-blur-md z-30 border-b border-slate-100">
        <button 
          onClick={() => setSidebarOpen(true)}
          className="p-2 -ml-2 text-slate-600 hover:bg-slate-50 rounded-lg"
        >
          <Menu size={24} />
        </button>
        <span className="ml-4 font-bold text-slate-800">Rentant</span>
      </div>

      <Sidebar
        open={sidebarOpen}
        onOpenChange={setSidebarOpen}
        activePage="/admin/rentals"
      />

      <main className="flex-1 overflow-auto pt-20 md:pt-4 pr-4">
        {/* Added extra padding and a rounded container for the dashboard content */}
        <div className="h-full w-full">
          <AdminRentals/>
        </div>
      </main>
    </div>
  );
}