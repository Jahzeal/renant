"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight, User, Mail, FileText } from "lucide-react";
import Header from "@/components/header";

export default function AccountSettingsPage() {
  const [activeTab, setActiveTab] = useState("account-settings");

  const settingsItems = [
    {
      id: "profile",
      icon: User,
      title: "Profile",
      description:
        "Personalize your account and update your sign in preferences.",
    },
    {
      id: "notifications",
      icon: Mail,
      title: "Notifications",
      description: "Manage the content and frequency of your Zillow emails.",
    },
    {
      id: "documents",
      icon: FileText,
      title: "Document Preferences",
      description:
        "View your legal documents, and manage your preferences for receiving and signing documents.",
    },
  ];

  return (
    <>
      <Header />
      <div className="min-h-screen bg-white">
        {/* Navigation Tabs */}
        <nav className="border-b border-border bg-white sticky top-0 z-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-6 overflow-x-auto">
              <Link
                href="/saved-homes"
                className="px-0 py-4 text-sm font-medium text-foreground/70 hover:text-foreground border-b-2 border-transparent transition-colors whitespace-nowrap"
              >
                Saved homes
              </Link>

              <button
                onClick={() => setActiveTab("account-settings")}
                className={`px-0 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === "account-settings"
                    ? "text-primary border-primary"
                    : "text-foreground/70 hover:text-foreground border-transparent"
                }`}
              >
                Account settings
              </button>
              <Link
                href="#"
                className="px-0 py-4 text-sm font-medium text-foreground/70 hover:text-foreground border-b-2 border-transparent transition-colors whitespace-nowrap"
              >
                Recently Viewed
              </Link>
              <Link
                href="#"
                className="px-0 py-4 text-sm font-medium text-foreground/70 hover:text-foreground border-b-2 border-transparent transition-colors whitespace-nowrap"
              >
                Manage tours
              </Link>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold text-foreground mb-8">
            Account settings
          </h1>

          {/* Settings Items */}
          <div className="space-y-0">
            {settingsItems.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <div key={item.id}>
                  <button className="w-full flex items-center justify-between py-6 px-6 hover:bg-muted/50 transition-colors group">
                    <div className="flex items-center gap-6 text-left flex-1">
                      <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full bg-muted">
                        <IconComponent size={24} className="text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground text-lg">
                          {item.title}
                        </h3>
                        <p className="text-sm text-foreground/60 mt-1">
                          {item.description}
                        </p>
                      </div>
                    </div>
                    <ChevronRight
                      size={24}
                      className="text-primary flex-shrink-0 group-hover:translate-x-1 transition-transform"
                    />
                  </button>
                  {index < settingsItems.length - 1 && (
                    <div className="border-t border-border" />
                  )}
                </div>
              );
            })}
          </div>
        </main>
      </div>
    </>
  );
}
