"use client";

import { useState } from "react";
import { checkPaymentStatus } from "@/app/actions/booking";
import { RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CheckStatusButton({ bookingCode }: { bookingCode: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleCheckStatus = async () => {
    setLoading(true);
    try {
      const res = await checkPaymentStatus(bookingCode);
      if (res.success) {
        // Refresh the page so the server component re-fetches the updated data
        router.refresh();
      } else {
        alert(res.error || "Gagal mengecek status. Coba beberapa saat lagi.");
      }
    } catch (err) {
      console.error("Error checking status", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleCheckStatus}
      disabled={loading}
      className="inline-flex items-center gap-1 px-3 py-1 bg-white dark:bg-gray-700 text-[#5000ef] dark:text-[#00c3cb] text-xs font-bold rounded-full hover:bg-gray-50 dark:hover:bg-gray-600 transition disabled:opacity-50 border border-[#5000ef]/20"
    >
      <RefreshCw className={`w-3 h-3 ${loading ? "animate-spin" : ""}`} />
      {loading ? "Mengecek..." : "Cek Status Midtrans"}
    </button>
  );
}
