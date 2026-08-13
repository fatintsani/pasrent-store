"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Search, Ticket } from "lucide-react";

export default function TrackingPage() {
  const [bookingCode, setBookingCode] = React.useState("");
  const router = useRouter();

  function handleTrack(e: React.FormEvent) {
    e.preventDefault();
    if (!bookingCode) return;
    
    // Redirect to the e-ticket page
    router.push(`/ticket/${bookingCode.trim()}`);
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0d0e11] flex flex-col transition-colors duration-300">
      <main className="flex-1 flex flex-col items-center justify-center p-6 pt-32 mb-20">
        <div className="w-full max-w-2xl">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Lacak <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5000ef] to-[#00c3cb]">E-Ticket</span>
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Masukkan Kode Booking Anda untuk melihat status pesanan dan E-Ticket.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl border border-gray-200 dark:border-gray-800 mb-8 shadow-sm">
            <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <Ticket className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  required
                  value={bookingCode}
                  onChange={(e) => setBookingCode(e.target.value)}
                  placeholder="Contoh: BKG-2026..."
                  className="w-full pl-12 pr-5 py-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#5000ef]/50 dark:focus:ring-[#00c3cb]/50 transition text-gray-900 dark:text-white font-medium"
                />
              </div>
              <button
                type="submit"
                disabled={!bookingCode}
                className="px-8 py-4 bg-gradient-to-r from-[#5000ef] to-[#00c3cb] text-white font-bold rounded-2xl hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2 min-w-[140px] shadow-md shadow-[#5000ef]/20"
              >
                <Search className="w-5 h-5" /> Lacak
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
