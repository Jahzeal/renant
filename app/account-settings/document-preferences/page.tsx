"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import PageHeader from "@/components/page-header"

export default function DocumentPreferencesPage() {
  const [paperlessEnabled, setPaperlessEnabled] = useState(false)

  return (
    <>
      <PageHeader />
      <div className="flex flex-col bg-white min-h-[calc(100vh-64px)]">
        {/* Back Navigation */}
        <div className="border-b border-border bg-white sticky top-0 z-20">
          <div className="w-full max-w-4xl mx-auto px-3 sm:px-4 md:px-6 py-4">
            <Link
              href="/account-settings"
              className="flex items-center gap-2 text-primary hover:text-primary/80 font-medium text-sm"
            >
              <ChevronLeft size={18} />
              Back to Account settings
            </Link>
          </div>
        </div>

        <main className="flex-1 overflow-y-auto">
          <div className="w-full max-w-4xl mx-auto px-3 sm:px-4 md:px-6 py-6 sm:py-8 md:py-12">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-8">Document preferences</h1>

            {/* Content Container */}
            <div className="border border-border rounded-lg p-6 sm:p-8">
              {/* My Paperless Preferences */}
              <div className="mb-10">
                <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-6">My Paperless Preferences</h2>

                {/* Why go paperless? */}
                <div className="mb-8">
                  <h3 className="font-semibold text-foreground mb-3 text-base">Why go paperless?</h3>
                  <p className="text-sm text-foreground/70 leading-relaxed mb-4">
                    If you agree, you'll receive and sign any documents electronically. If you do not agree, any
                    documents will be mailed to you.
                  </p>
                  <p className="text-sm text-foreground/70">
                    For more info, please read about{" "}
                    <button className="text-primary hover:text-primary/80 font-medium">electronic signatures</button>
                    <span className="text-primary hover:text-primary/80 font-medium"> here</span>
                  </p>
                </div>

                {/* Your Settings */}
                <div className="mb-8">
                  <h3 className="font-semibold text-foreground mb-4 text-base">Your Settings</h3>
                  <div className="flex items-center justify-between p-4 border border-border/50 rounded-lg">
                    <p className="text-sm text-foreground/70">
                      I agree to receive and sign documents electronically for all of Zillow Group Companies.
                    </p>
                    <button
                      onClick={() => setPaperlessEnabled(!paperlessEnabled)}
                      className={`w-12 h-7 rounded-full transition-colors flex items-center px-1 flex-shrink-0 ${
                        paperlessEnabled ? "bg-primary" : "bg-gray-300"
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full bg-white transition-transform ${
                          paperlessEnabled ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Advanced Settings */}
                {/* <div>
                  <button className="text-primary hover:text-primary/80 font-semibold text-base">
                    Advanced Settings
                  </button>
                </div> */}
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}
