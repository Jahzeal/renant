"use client"

import { useState } from "react"
import Sidebar from "./sidebar"
import Dashboard from "./dashboard"

export default function AdminPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="flex h-screen bg-background">
      <Sidebar open={sidebarOpen} onOpenChange={setSidebarOpen} />
      <main className="flex-1 overflow-auto">
        <Dashboard />
      </main>
    </div>
  )
}
