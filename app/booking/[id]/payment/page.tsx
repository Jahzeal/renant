"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, CreditCard, Banknote, Smartphone } from "lucide-react";

export default function PaymentPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedPayment, setSelectedPayment] = useState<
    "card" | "bank" | "opay" | null
  >("card");
  const [isProcessing, setIsProcessing] = useState(false);

  const checkInDate = searchParams.get("checkIn");
  const checkOutDate = searchParams.get("checkOut");

  const checkIn = checkInDate ? new Date(checkInDate) : null;
  const checkOut = checkOutDate ? new Date(checkOutDate) : null;

  const nights =
    checkIn && checkOut
      ? Math.ceil(
          (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)
        )
      : 0;
  const nightly = 120;
  const subtotal = nights * nightly;
  const cautionFee = Math.round(subtotal * 0.2);
  const serviceFee = Math.round(subtotal * 0.1);
  const total = subtotal + cautionFee + serviceFee;

  const handlePayment = async () => {
    if (!selectedPayment) {
      alert("Please select a payment method");
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      router.push(`/booking/${params.id}/confirmation`);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-white rounded-lg transition-colors"
          >
            <ChevronLeft size={24} className="text-slate-700" />
          </button>
          <h1 className="text-3xl font-bold text-slate-900">
            Payment Checkout
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Payment Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Payment Methods */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <h2 className="text-xl font-semibold text-slate-900 mb-6">
                Select Payment Method
              </h2>

              <div className="space-y-4">
                {/* Credit/Debit Card */}
                <button
                  onClick={() => setSelectedPayment("card")}
                  className={`w-full p-4 rounded-xl border-2 flex items-center gap-4 transition-all ${
                    selectedPayment === "card"
                      ? "border-blue-600 bg-blue-50"
                      : "border-slate-200 hover:border-slate-300 bg-white"
                  }`}
                >
                  <CreditCard
                    size={28}
                    className={
                      selectedPayment === "card"
                        ? "text-blue-600"
                        : "text-slate-400"
                    }
                  />
                  <div className="text-left flex-1">
                    <p className="font-semibold text-slate-900">
                      Credit/Debit Card
                    </p>
                    <p className="text-sm text-slate-600">
                      Visa, Mastercard, American Express
                    </p>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full border-2 ${
                      selectedPayment === "card"
                        ? "border-blue-600 bg-blue-600"
                        : "border-slate-300"
                    }`}
                  />
                </button>

                {/* Bank Transfer */}
                <button
                  onClick={() => setSelectedPayment("bank")}
                  className={`w-full p-4 rounded-xl border-2 flex items-center gap-4 transition-all ${
                    selectedPayment === "bank"
                      ? "border-blue-600 bg-blue-50"
                      : "border-slate-200 hover:border-slate-300 bg-white"
                  }`}
                >
                  <Banknote
                    size={28}
                    className={
                      selectedPayment === "bank"
                        ? "text-blue-600"
                        : "text-slate-400"
                    }
                  />
                  <div className="text-left flex-1">
                    <p className="font-semibold text-slate-900">
                      Bank Transfer
                    </p>
                    <p className="text-sm text-slate-600">
                      Direct bank transfer via Paystack
                    </p>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full border-2 ${
                      selectedPayment === "bank"
                        ? "border-blue-600 bg-blue-600"
                        : "border-slate-300"
                    }`}
                  />
                </button>

                {/* OPay */}
                <button
                  onClick={() => setSelectedPayment("opay")}
                  className={`w-full p-4 rounded-xl border-2 flex items-center gap-4 transition-all ${
                    selectedPayment === "opay"
                      ? "border-blue-600 bg-blue-50"
                      : "border-slate-200 hover:border-slate-300 bg-white"
                  }`}
                >
                  <Smartphone
                    size={28}
                    className={
                      selectedPayment === "opay"
                        ? "text-blue-600"
                        : "text-slate-400"
                    }
                  />
                  <div className="text-left flex-1">
                    <p className="font-semibold text-slate-900">OPay</p>
                    <p className="text-sm text-slate-600">
                      Mobile money payment via OPay
                    </p>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full border-2 ${
                      selectedPayment === "opay"
                        ? "border-blue-600 bg-blue-600"
                        : "border-slate-300"
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Card Details Form */}
            {selectedPayment === "card" && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-6">
                <h3 className="text-lg font-semibold text-slate-900">
                  Card Information
                </h3>

                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-2">
                    Card Number
                  </label>
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    className="w-full border border-slate-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-slate-700 block mb-2">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      className="w-full border border-slate-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 block mb-2">
                      CVV
                    </label>
                    <input
                      type="text"
                      placeholder="123"
                      className="w-full border border-slate-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-2">
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    className="w-full border border-slate-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            )}

            {/* Bank Transfer Instructions */}
            {selectedPayment === "bank" && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">
                  Bank Transfer Details
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <p className="text-slate-600 mb-1">Bank Name</p>
                    <p className="font-semibold text-slate-900">
                      First Bank Nigeria
                    </p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <p className="text-slate-600 mb-1">Account Number</p>
                    <p className="font-semibold text-slate-900">1234567890</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <p className="text-slate-600 mb-1">Account Name</p>
                    <p className="font-semibold text-slate-900">
                      Real Estate Bookings Ltd
                    </p>
                  </div>
                  <p className="text-slate-600 pt-2">
                    Please transfer the exact amount and confirm your booking
                    reference in the payment description.
                  </p>
                </div>
              </div>
            )}

            {/* OPay Instructions */}
            {selectedPayment === "opay" && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">
                  OPay Payment
                </h3>
                <div className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                    <p className="text-blue-900 text-sm">
                      You will be redirected to OPay to complete your payment.
                      Your booking will be confirmed once payment is verified.
                    </p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <p className="text-slate-600 mb-1">OPay Account</p>
                    <p className="font-semibold text-slate-900">
                      +234 800 OPAY
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 sticky top-8">
              <h3 className="text-lg font-semibold text-slate-900 mb-6">
                Order Summary
              </h3>

              <div className="space-y-4 mb-6 pb-6 border-b border-slate-200">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Check-in</span>
                  <span className="font-medium text-slate-900">
                    {checkIn?.toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Check-out</span>
                  <span className="font-medium text-slate-900">
                    {checkOut?.toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Number of nights</span>
                  <span className="font-medium text-slate-900">{nights}</span>
                </div>
              </div>

              <div className="space-y-3 mb-6 pb-6 border-b border-slate-200">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">
                    ₦{nightly}/night × {nights} nights
                  </span>
                  <span className="font-medium text-slate-900">
                    ₦{subtotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Caution Fee (20%)</span>
                  <span className="font-medium text-slate-900">
                    ₦{cautionFee.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Service Fee</span>
                  <span className="font-medium text-slate-900">
                    ₦{serviceFee.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center mb-6">
                <span className="text-slate-900 font-semibold">
                  Total Amount
                </span>
                <span className="text-2xl font-bold text-blue-600">
                  ₦{total.toLocaleString()}
                </span>
              </div>

              <button
                onClick={handlePayment}
                disabled={isProcessing}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
              >
                {isProcessing
                  ? "Processing..."
                  : `Pay ₦${total.toLocaleString()}`}
              </button>

              <p className="text-xs text-slate-600 text-center mt-4">
                Your payment is secure and encrypted
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
