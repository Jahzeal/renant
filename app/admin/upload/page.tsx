"use client"

import { useState } from "react"
import Sidebar from "../sidebar"
import PropertyUpload from "./property-upload"

export default function UploadPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen bg-background">
      <Sidebar open={sidebarOpen} onOpenChange={setSidebarOpen} activePage="/admin/upload" />
      <main className="flex-1 overflow-auto">
        <PropertyUpload />
      </main>
    </div>
  )
}
