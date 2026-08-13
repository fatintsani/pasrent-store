"use server";

import { createClient } from "@/utils/supabase/server";

export async function processScannedTicket(bookingCode: string) {
  try {
    const supabase = await createClient();

    // 1. Get the booking
    const { data: booking, error: getError } = await supabase
      .from("bookings")
      .select("*")
      .eq("booking_code", bookingCode)
      .single();

    if (getError || !booking) {
      return { success: false, error: "Tiket tidak ditemukan. Pastikan kode QR valid." };
    }

    // 2. Check status
    if (booking.status === 'completed') {
      return { success: false, error: "Pesanan ini sudah selesai." };
    }
    if (booking.status === 'cancelled') {
      return { success: false, error: "Pesanan ini sudah dibatalkan." };
    }
    if (booking.status === 'in_progress') {
      return { success: false, error: "Pesanan ini sedang dalam masa sewa (In Progress)." };
    }
    if (booking.status === 'pending') {
      return { success: false, error: "Pesanan ini belum dikonfirmasi atau belum dibayar." };
    }

    // 3. Update status to in_progress
    const { error: updateError } = await supabase
      .from("bookings")
      .update({ status: 'in_progress' })
      .eq("id", booking.id);

    if (updateError) {
      return { success: false, error: "Gagal memperbarui status tiket: " + updateError.message };
    }

    return { 
      success: true, 
      message: `Berhasil! Status pesanan ${bookingCode} atas nama ${booking.customer_name} telah diubah menjadi "In Progress".`,
      bookingId: booking.id
    };

  } catch (error: any) {
    return { success: false, error: "Terjadi kesalahan sistem." };
  }
}
