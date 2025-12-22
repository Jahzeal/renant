"use client";

import Link from "next/link";
import { ChevronRight, User, Mail, FileText } from "lucide-react";
// import Header from "@/components/header"
import PageHeader from "@/components/page-header";

export default function AccountSettingsPage() {
  const settingsItems = [
    {
      id: "profile",
      icon: User,
      title: "Profile",
      description:
        "Personalize your account and update your sign in preferences.",
      href: "/account-settings/profile",
    },
    {
      id: "notifications",
      icon: Mail,
      title: "Notifications",
      description: "Manage the content and frequency of your Zillow emails.",
      href: "/account-settings/notifications",
    },
    {
      id: "documents",
      icon: FileText,
      title: "Document Preferences",
      description:
        "View your legal documents, and manage your preferences for receiving and signing documents.",
      href: "/account-settings/document-preferences",
    },
  ];

  return (
    <>
      <PageHeader />
      <div className="flex flex-col bg-white min-h-[calc(100vh-64px)]">
        {/* Navigation Tabs */}
        <div className="border-b bg-white">
          <div className="w-full px-3 sm:px-6">
            <div className="h-14 sm:h-16 flex items-center">
              <nav
                className="
          flex flex-nowrap gap-4 sm:gap-6
          overflow-x-auto
          scrollbar-hide
          text-xs sm:text-sm
          flex-1
        "
              >
                <Link
                  href="/saved-homes"
                  className="pb-3 sm:pb-4 border-b-2 border-transparent text-muted-foreground hover:text-foreground whitespace-nowrap"
                >
                  Saved homes
                </Link>

                <Link
                  href="/manage-tours"
                  className="pb-3 sm:pb-4 border-b-2 border-transparent text-muted-foreground hover:text-foreground whitespace-nowrap"
                >
                  Manage tours
                </Link>

                <Link
                  href="/renter-hub"
                  className="pb-3 sm:pb-4 border-b-2 border-transparent text-muted-foreground hover:text-foreground whitespace-nowrap"
                >
                  Renter Hub
                </Link>

                <Link
                  href="/account-settings"
                  className="pb-3 sm:pb-4 border-b-2 border-primary text-primary font-medium whitespace-nowrap"
                >
                  Account settings
                </Link>

                <Link
                  href="/how-it-works"
                  className="pb-3 sm:pb-4 border-b-2 border-transparent text-muted-foreground hover:text-foreground whitespace-nowrap"
                >
                  How it works
                </Link>
              </nav>
            </div>
          </div>
        </div>

        <main className="flex-1 overflow-y-auto">
          <div className="w-full max-w-4xl mx-auto px-3 sm:px-4 md:px-6 py-6 sm:py-8 md:py-12">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-6 sm:mb-8">
              Account settings
            </h1>

            {/* Settings Items */}
            <div className="space-y-0">
              {settingsItems.map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <div key={item.id}>
                    <Link href={item.href}>
                      <button className="w-full flex items-center justify-between py-4 sm:py-6 px-3 sm:px-6 hover:bg-muted/50 transition-colors group">
                        <div className="flex items-center gap-3 sm:gap-6 text-left flex-1 min-w-0">
                          <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-muted">
                            <IconComponent
                              size={20}
                              className="sm:w-6 sm:h-6 text-primary"
                            />
                          </div>
                          <div className="min-w-0">
                            <h3 className="font-semibold text-foreground text-base sm:text-lg">
                              {item.title}
                            </h3>
                            <p className="text-xs sm:text-sm text-foreground/60 mt-1 line-clamp-2">
                              {item.description}
                            </p>
                          </div>
                        </div>
                        <ChevronRight
                          size={20}
                          className="sm:w-6 sm:h-6 text-primary flex-shrink-0 group-hover:translate-x-1 transition-transform ml-2"
                        />
                      </button>
                    </Link>
                    {index < settingsItems.length - 1 && (
                      <div className="border-t border-border" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
