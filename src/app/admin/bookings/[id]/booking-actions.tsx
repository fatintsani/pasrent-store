"use client";

import { useState } from "react";
import { updateBookingStatus, updatePaymentStatus } from "@/app/actions/admin/bookings";
import { Loader2 } from "lucide-react";

export default function BookingActions({ booking }: { booking: any }) {
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  const handleUpdateStatus = async (newStatus: string) => {
    if (!window.confirm(`Yakin ingin mengubah status pesanan menjadi ${newStatus.toUpperCase()}?`)) return;
    
    setLoadingAction(newStatus);
    const res = await updateBookingStatus(booking.id, newStatus);
    if (!res.success) alert(res.error);
    setLoadingAction(null);
  };

  const handleUpdatePayment = async (newStatus: string) => {
    if (!window.confirm(`Yakin ingin menandai pembayaran sebagai ${newStatus.toUpperCase()}?`)) return;
    
    setLoadingAction(`payment_${newStatus}`);
    const res = await updatePaymentStatus(booking.id, newStatus);
    if (!res.success) alert(res.error);
    setLoadingAction(null);
  };

  return (
    <div className="bg-[#5000ef]/5 dark:bg-[#00c3cb]/5 p-6 rounded-2xl border border-[#5000ef]/20 dark:border-[#00c3cb]/20">
      <h3 className="text-lg font-bold mb-4">Aksi Admin</h3>
      <div className="flex flex-wrap gap-3">
        {booking.payment_status === 'pending' && (
          <button 
            onClick={() => handleUpdatePayment('paid')}
            disabled={!!loadingAction}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition disabled:opacity-50"
          >
            {loadingAction === 'payment_paid' && <Loader2 className="w-4 h-4 animate-spin" />}
            Tandai Sudah Bayar
          </button>
        )}
        
        {booking.status === 'pending' && (
          <button 
            onClick={() => handleUpdateStatus('confirmed')}
            disabled={!!loadingAction}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition disabled:opacity-50"
          >
            {loadingAction === 'confirmed' && <Loader2 className="w-4 h-4 animate-spin" />}
            Konfirmasi Pesanan
          </button>
        )}
        
        {booking.status === 'confirmed' && (
          <button 
            onClick={() => handleUpdateStatus('in_progress')}
            disabled={!!loadingAction}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition disabled:opacity-50"
          >
            {loadingAction === 'in_progress' && <Loader2 className="w-4 h-4 animate-spin" />}
            Mulai Sewa (In Progress)
          </button>
        )}
        
        {booking.status === 'in_progress' && (
          <button 
            onClick={() => handleUpdateStatus('completed')}
            disabled={!!loadingAction}
            className="flex items-center gap-2 bg-gray-800 hover:bg-gray-900 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition disabled:opacity-50"
          >
            {loadingAction === 'completed' && <Loader2 className="w-4 h-4 animate-spin" />}
            Selesaikan Sewa
          </button>
        )}
        
        {booking.status !== 'cancelled' && (
          <button 
            onClick={() => handleUpdateStatus('cancelled')}
            disabled={!!loadingAction}
            className="flex items-center gap-2 bg-rose-100 text-rose-600 hover:bg-rose-200 px-5 py-2.5 rounded-xl text-sm font-bold transition ml-auto disabled:opacity-50"
          >
            {loadingAction === 'cancelled' && <Loader2 className="w-4 h-4 animate-spin" />}
            Batalkan
          </button>
        )}
      </div>
    </div>
  );
}
