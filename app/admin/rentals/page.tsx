"use client"

import { useState } from "react"
import Sidebar from "../sidebar"
import AdminRentals from "./allListings"


export default function UploadPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen bg-background">
      <Sidebar open={sidebarOpen} onOpenChange={setSidebarOpen} activePage="/admin/rentals" />
      <main className="flex-1 overflow-auto">
        <AdminRentals />
      </main>
    </div>
  )
}
