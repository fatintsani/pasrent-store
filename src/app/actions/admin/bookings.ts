"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateBookingStatus(id: string, newStatus: string) {
  try {
    const supabase = await createClient();
    
    const { error } = await supabase
      .from("bookings")
      .update({ status: newStatus })
      .eq("id", id);

    if (error) {
      return { success: false, error: "Gagal memperbarui status: " + error.message };
    }

    revalidatePath("/admin/bookings");
    revalidatePath(`/admin/bookings/${id}`);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: "Terjadi kesalahan sistem." };
  }
}

export async function updatePaymentStatus(id: string, newStatus: string) {
  try {
    const supabase = await createClient();
    
    const { error } = await supabase
      .from("bookings")
      .update({ payment_status: newStatus })
      .eq("id", id);

    if (error) {
      return { success: false, error: "Gagal memperbarui status pembayaran: " + error.message };
    }

    revalidatePath("/admin/bookings");
    revalidatePath(`/admin/bookings/${id}`);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: "Terjadi kesalahan sistem." };
  }
}
