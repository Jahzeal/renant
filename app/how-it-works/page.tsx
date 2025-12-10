"use client";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function HowItWorks() {
  const router = useRouter();

  const steps = [
    {
      number: 1,
      title: "Find Asset",
      description:
        "Browse our marketplace and find the perfect asset for your needs",
    },
    {
      number: 2,
      title: "Secure Payment",
      description:
        "Funds are held securely in escrow until the transaction is complete",
    },
    {
      number: 3,
      title: "Verify & Transfer",
      description:
        "Asset is verified and transferred to the buyer with full documentation",
    },
    {
      number: 4,
      title: "Complete Deal",
      description: "Funds are released to the seller after successful delivery",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
            >
              <ChevronLeft size={24} className="text-foreground" />
            </button>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
              How Enscroll Works
            </h1>
            <div className="w-10" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="bg-background">
        {/* Hero Section */}
        {/* <section className="bg-primary text-primary-foreground py-12 sm:py-16 lg:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              How Enscroll Works
            </h2>
            <p className="text-lg sm:text-xl opacity-90">
              Simple, secure, and transparent process
            </p>
          </div>
        </section> */}

        {/* Steps Section */}
        <section className="py-12 sm:py-16 lg:py-20 bg-background">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-12 sm:space-y-16">
              {steps.map((step) => (
                <div
                  key={step.number}
                  className="flex flex-col sm:flex-row gap-6 sm:gap-8 items-center sm:items-center text-center sm:text-left"
                >
                  {/* Step Number */}
                  <div className="flex-shrink-0">
                    <div className="relative">
                      <div className="absolute inset-0 bg-accent rounded-full blur-lg opacity-60" />
                      <div className="relative w-20 h-20 sm:w-24 sm:h-24 bg-primary rounded-full flex items-center justify-center">
                        <span className="text-3xl sm:text-4xl font-bold text-primary-foreground">
                          {step.number}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Step Content */}
                  <div className="flex-1 w-full">
                    <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
                      {step.title}
                    </h3>
                    <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-muted py-12 sm:py-16 lg:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
              Ready to get started?
            </h3>
            <p className="text-lg text-muted-foreground mb-8">
              Join thousands of satisfied users on Enscroll
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/buyer"
                className="inline-flex items-center justify-center px-6 sm:px-8 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors"
              >
                Start Buying
              </Link>

              <Link
                href="/seller"
                className="inline-flex items-center justify-center px-6 sm:px-8 py-3 bg-secondary text-secondary-foreground font-semibold rounded-lg hover:bg-muted transition-colors"
              >
                Start Selling
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
