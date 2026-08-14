import { BookingForm } from "@/components/booking-form";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Booking Sekarang - Pasrent Store",
  description: "Pilih jadwal, konsol, dan game untuk disewa di Pasrent Store.",
};

export default function BookingPage() {
  return (
    <main className="min-h-screen pt-20 sm:pt-24 pb-16 sm:pb-20 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">

        <div className="text-center mb-8 sm:mb-12 mt-4 sm:mt-8 px-2">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tighter text-gray-900 dark:text-white leading-tight">
            Pesan <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5000ef] to-[#00c3cb]">Konsol Impianmu</span>
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-400 mt-3 sm:mt-4 max-w-lg mx-auto leading-relaxed">
            Sewa PS4 dan PS5 dengan mudah. Pilih konsol, paket, dan game favoritmu. Kami yang antar!
          </p>
        </div>
        
        <BookingForm />
      </div>
    </main>
  );
}
