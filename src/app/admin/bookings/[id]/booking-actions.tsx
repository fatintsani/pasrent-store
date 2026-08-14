"use client";

import { useState } from "react";
import { updateBookingStatus, updatePaymentStatus, updateInternalNotes } from "@/app/actions/admin/bookings";
import { Loader2, AlertCircle, X, Save } from "lucide-react";

export default function BookingActions({ booking }: { booking: any }) {
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [internalNotes, setInternalNotes] = useState(booking.internal_notes || "");
  
  // Custom Modal State
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    confirmText?: string;
    isAlert?: boolean;
    type?: 'warning' | 'info';
  }>({
    isOpen: false,
    title: "",
    message: "",
    isAlert: false,
    onConfirm: () => {},
  });

  const closeDialog = () => setConfirmDialog(prev => ({ ...prev, isOpen: false }));

  const confirmAction = (title: string, message: string, onConfirm: () => void, confirmText = "Ya, Lanjutkan") => {
    setConfirmDialog({
      isOpen: true,
      title,
      message,
      onConfirm,
      confirmText,
      isAlert: false,
      type: 'info'
    });
  };

  const handleUpdateStatus = (newStatus: string) => {
    confirmAction(
      "Konfirmasi Ubah Status",
      `Yakin ingin mengubah status pesanan menjadi ${newStatus.toUpperCase()}?`,
      async () => {
        closeDialog();
        setLoadingAction(newStatus);
        const res = await updateBookingStatus(booking.id, newStatus);
        if (!res.success) {
          setTimeout(() => {
            setConfirmDialog({
              isOpen: true,
              title: "Gagal Mengubah Status",
              message: res.error || "Terjadi kesalahan.",
              isAlert: true,
              onConfirm: closeDialog
            });
          }, 300);
        }
        setLoadingAction(null);
      }
    );
  };

  const handleUpdatePayment = (newStatus: string) => {
    confirmAction(
      "Konfirmasi Pembayaran",
      `Yakin ingin menandai pembayaran sebagai ${newStatus.toUpperCase()}?`,
      async () => {
        closeDialog();
        setLoadingAction(`payment_${newStatus}`);
        const res = await updatePaymentStatus(booking.id, newStatus);
        if (!res.success) {
          setTimeout(() => {
            setConfirmDialog({
              isOpen: true,
              title: "Gagal Mengubah Status",
              message: res.error || "Terjadi kesalahan.",
              isAlert: true,
              onConfirm: closeDialog
            });
          }, 300);
        }
        setLoadingAction(null);
      }
    );
  };

  const handleSaveNotes = async () => {
    setLoadingAction("save_notes");
    const res = await updateInternalNotes(booking.id, internalNotes);
    if (!res.success) {
      setTimeout(() => {
        setConfirmDialog({
          isOpen: true,
          title: "Gagal Menyimpan Catatan",
          message: res.error || "Terjadi kesalahan.",
          isAlert: true,
          onConfirm: closeDialog
        });
      }, 300);
    }
    setLoadingAction(null);
  };

  return (
    <>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 mb-6 print:hidden">
        <h3 className="text-lg font-bold mb-4 flex items-center justify-between">
          Catatan Internal
          <button
            onClick={handleSaveNotes}
            disabled={loadingAction === "save_notes"}
            className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 px-3 py-1.5 rounded-lg text-xs font-bold transition disabled:opacity-50"
          >
            {loadingAction === 'save_notes' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            Simpan
          </button>
        </h3>
        <textarea
          value={internalNotes}
          onChange={(e) => setInternalNotes(e.target.value)}
          placeholder="Tambahkan catatan khusus untuk pesanan ini (tidak terlihat oleh pelanggan)..."
          className="w-full h-24 p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-[#5000ef] outline-none transition resize-none"
        ></textarea>
      </div>

      <div className="bg-[#5000ef]/5 dark:bg-[#00c3cb]/5 p-6 rounded-2xl border border-[#5000ef]/20 dark:border-[#00c3cb]/20 print:hidden">
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

      {/* Custom Confirm Dialog (Replacing window.confirm) */}
      {confirmDialog.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800">
              <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <AlertCircle className={`w-5 h-5 ${confirmDialog.isAlert ? 'text-rose-500' : 'text-blue-500'}`} />
                {confirmDialog.title}
              </h3>
              <button onClick={closeDialog} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <p className="text-gray-600 dark:text-gray-300">{confirmDialog.message}</p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-800/50 flex justify-end gap-3 border-t border-gray-100 dark:border-gray-800">
              {!confirmDialog.isAlert && (
                <button 
                  onClick={closeDialog}
                  className="px-4 py-2 font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl transition"
                >
                  Batal
                </button>
              )}
              <button 
                onClick={confirmDialog.isAlert ? closeDialog : confirmDialog.onConfirm}
                className={`px-4 py-2 font-bold text-white rounded-xl transition ${confirmDialog.isAlert ? 'bg-gray-900 hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600' : 'bg-[#5000ef] hover:bg-[#4000c0]'}`}
              >
                {confirmDialog.isAlert ? "Tutup" : (confirmDialog.confirmText || "Ya, Lanjutkan")}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
