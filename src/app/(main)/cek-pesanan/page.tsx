"use client";

import * as React from "react";
import Link from "next/link";
import { trackBooking } from "@/app/actions/track";
import { Search, Package, MapPin, Calendar, Clock, Loader2, ArrowLeft } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export default function TrackingPage() {
  const [trackingId, setTrackingId] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState("");
  const [bookingData, setBookingData] = React.useState<any>(null);

  async function handleTrack(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg("");
    setBookingData(null);
    setLoading(true);

    const res = await trackBooking(trackingId);
    if (res.success) {
      setBookingData(res.data);
    } else {
      setErrorMsg(res.error || "Pesanan tidak ditemukan.");
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0d0e11] flex flex-col transition-colors duration-300">
      <main className="flex-1 flex flex-col items-center justify-center p-6 pt-32 mb-20">
        <div className="w-full max-w-2xl">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Lacak <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5000ef] to-[#00c3cb]">Pesanan</span>
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Masukkan ID Pelacakan (Tracking ID) yang kami kirimkan ke email Anda saat melakukan pemesanan.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl border border-gray-200 dark:border-gray-800 mb-8">
            <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-4">
              <input
                type="text"
                required
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value)}
                placeholder="Masukkan Tracking ID (Misal: 550e8400-e29b-...)"
                className="flex-1 px-5 py-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#5000ef]/50 dark:focus:ring-[#00c3cb]/50 transition text-gray-900 dark:text-white"
              />
              <button
                type="submit"
                disabled={loading || !trackingId}
                className="px-8 py-4 bg-gradient-to-r from-[#5000ef] to-[#00c3cb] text-white font-bold rounded-2xl hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2 min-w-[140px]"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Search className="w-5 h-5" /> Lacak</>}
              </button>
            </form>
            
            {errorMsg && (
              <div className="mt-4 p-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-xl text-sm font-medium border border-red-200 dark:border-red-800">
                {errorMsg}
              </div>
            )}
          </div>

          {bookingData && (
            <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-xl border border-[#5000ef]/20 dark:border-[#00c3cb]/20 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center justify-between mb-8 border-b border-gray-100 dark:border-gray-800 pb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Detail Pesanan</h3>
                  <p className="text-gray-500 text-sm mt-1">{bookingData.id}</p>
                </div>
                <div className={`px-4 py-2 rounded-full text-sm font-bold capitalize
                  ${bookingData.status === 'pending' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400' : 
                    bookingData.status === 'confirmed' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400' : 
                    bookingData.status === 'selesai' ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400' : 
                    'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'}`}
                >
                  {bookingData.status}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex flex-col gap-6">
                  <div className="flex gap-4 items-start">
                    <div className="bg-[#5000ef]/10 dark:bg-[#00c3cb]/10 p-3 rounded-xl text-[#5000ef] dark:text-[#00c3cb]">
                      <Package className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Konsol & Durasi</p>
                      <p className="font-bold text-lg text-gray-900 dark:text-white">{bookingData.tipe_konsol}</p>
                      <p className="text-gray-700 dark:text-gray-300">{bookingData.durasi_sewa}</p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start">
                    <div className="bg-[#5000ef]/10 dark:bg-[#00c3cb]/10 p-3 rounded-xl text-[#5000ef] dark:text-[#00c3cb]">
                      <Calendar className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Jadwal Sewa</p>
                      <p className="font-bold text-lg text-gray-900 dark:text-white">{bookingData.tanggal_booking}</p>
                      <p className="text-gray-700 dark:text-gray-300 flex items-center gap-1">
                        <Clock className="w-4 h-4" /> Pukul {bookingData.waktu_booking.substring(0, 5)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-6">
                  <div className="flex gap-4 items-start">
                    <div className="bg-[#5000ef]/10 dark:bg-[#00c3cb]/10 p-3 rounded-xl text-[#5000ef] dark:text-[#00c3cb]">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Data Pemesan & Alamat</p>
                      <p className="font-bold text-lg text-gray-900 dark:text-white">{bookingData.nama_lengkap}</p>
                      <p className="text-gray-700 dark:text-gray-300 mb-1">{bookingData.no_whatsapp}</p>
                      <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed bg-gray-50 dark:bg-gray-800 p-3 rounded-lg mt-2 border border-gray-100 dark:border-gray-700">
                        {bookingData.alamat_pengiriman || "Ambil ke toko."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
