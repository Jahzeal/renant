"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronLeft, Bell, X, Search, Heart, TrendingUp, Lightbulb, Home, MessageSquare } from "lucide-react"
import PageHeader from "@/components/page-header"

export default function NotificationsPage() {
  const [emailEnabled, setEmailEnabled] = useState(true)
  const [pushEnabled, setPushEnabled] = useState(true)
  const [dismissedBanner, setDismissedBanner] = useState(false)

  const subscriptions = [
    { icon: Search, title: "Home matches", id: "home-matches" },
    { icon: Heart, title: "Saved homes", id: "saved-homes" },
    { icon: TrendingUp, title: "Market updates", id: "market-updates" },
    { icon: Lightbulb, title: "Zillow news", id: "zillow-news" },
    { icon: Home, title: "Your homeowner reports", id: "homeowner-reports" },
    { icon: MessageSquare, title: "Your messages", id: "messages" },
  ]

  return (
    <>
      <PageHeader />
      <div className="flex flex-col bg-white min-h-[calc(100vh-64px)]">
        {/* Back Navigation */}
        <div className="border-b border-border bg-white sticky top-0 z-20">
          <div className="w-full max-w-6xl mx-auto px-3 sm:px-4 md:px-6 py-4">
            <Link
              href="/account-settings"
              className="flex items-center gap-2 text-primary hover:text-primary/80 font-medium text-sm"
            >
              <ChevronLeft size={18} />
              Account settings
            </Link>
          </div>
        </div>

        <main className="flex-1 overflow-y-auto">
          <div className="w-full max-w-6xl mx-auto px-3 sm:px-4 md:px-6 py-6 sm:py-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-8">Notifications</h1>

            <div className="flex flex-col md:flex-row gap-6 lg:gap-8">
              {/* Left Sidebar */}
              <div className="md:w-64 flex-shrink-0">
                <div className="border border-border rounded-lg p-4 sticky top-24">
                  <h3 className="font-semibold text-foreground mb-4 text-sm">Notification type</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-100 cursor-pointer hover:bg-gray-200 transition-colors">
                      <Bell size={18} className="text-foreground flex-shrink-0" />
                      <span className="text-sm font-medium text-foreground">Email, Push</span>
                    </div>
                  </div>

                  <h3 className="font-semibold text-foreground mt-8 mb-4 text-sm">Your subscriptions</h3>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {subscriptions.map((sub) => {
                      const Icon = sub.icon
                      return (
                        <div
                          key={sub.id}
                          className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer text-sm"
                        >
                          <Icon size={16} className="text-foreground/60 flex-shrink-0" />
                          <span className="text-sm text-foreground/70 truncate">{sub.title}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* Right Content Area */}
              <div className="flex-1">
                <div className="border border-border rounded-lg p-6 sm:p-8">
                  {/* Notification Type Section */}
                  <div className="mb-8">
                    <h2 className="font-semibold text-foreground mb-1 text-base">Notification type</h2>
                    <p className="text-sm text-foreground/60 mb-6">
                      Control how you want to be notified across your subscriptions.
                    </p>

                    <div className="space-y-4">
                      {/* Email Toggle */}
                      <div className="flex items-center justify-between p-3 border-b border-gray-200 pb-4">
                        <span className="font-medium text-foreground text-sm">Email</span>
                        <button
                          onClick={() => setEmailEnabled(!emailEnabled)}
                          className={`w-11 h-6 rounded-full transition-all flex items-center px-0.5 ${
                            emailEnabled ? "bg-blue-500" : "bg-gray-300"
                          }`}
                          aria-label="Toggle email notifications"
                        >
                          <div
                            className={`w-5 h-5 rounded-full bg-white transition-transform ${
                              emailEnabled ? "translate-x-5" : "translate-x-0"
                            }`}
                          />
                        </button>
                      </div>

                      {/* Push Toggle */}
                      <div className="flex items-center justify-between p-3">
                        <span className="font-medium text-foreground text-sm">Push</span>
                        <button
                          onClick={() => setPushEnabled(!pushEnabled)}
                          className={`w-11 h-6 rounded-full transition-all flex items-center px-0.5 ${
                            pushEnabled ? "bg-blue-500" : "bg-gray-300"
                          }`}
                          aria-label="Toggle push notifications"
                        >
                          <div
                            className={`w-5 h-5 rounded-full bg-white transition-transform ${
                              pushEnabled ? "translate-x-5" : "translate-x-0"
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Info Banner */}
                  {!dismissedBanner && (
                    <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-white text-xs font-bold">i</span>
                      </div>
                      <div className="flex-1">
                        <span className="text-sm text-foreground">
                          <button className="text-blue-600 hover:text-blue-700 font-medium">Download the app</button> to
                          receive push notifications.
                        </span>
                      </div>
                      <button
                        onClick={() => setDismissedBanner(true)}
                        className="text-foreground/60 hover:text-foreground flex-shrink-0"
                        aria-label="Close banner"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}
