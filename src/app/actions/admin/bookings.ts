"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateBookingStatus(id: string, newStatus: string) {
  try {
    const supabase = await createClient();
    
    const { data: oldData } = await supabase.from("bookings").select("status").eq("id", id).single();

    const { error } = await supabase
      .from("bookings")
      .update({ status: newStatus })
      .eq("id", id);

    if (error) {
      return { success: false, error: "Gagal memperbarui status: " + error.message };
    }

    if (oldData && oldData.status !== newStatus) {
      await supabase.from("booking_status_logs").insert({
        booking_id: id,
        previous_status: oldData.status,
        new_status: newStatus,
        changed_by: "Admin"
      });
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
    
    const { data: oldData } = await supabase.from("bookings").select("payment_status").eq("id", id).single();

    const { error } = await supabase
      .from("bookings")
      .update({ payment_status: newStatus })
      .eq("id", id);

    if (error) {
      return { success: false, error: "Gagal memperbarui status pembayaran: " + error.message };
    }

    if (oldData && oldData.payment_status !== newStatus) {
      await supabase.from("booking_status_logs").insert({
        booking_id: id,
        previous_status: `Payment: ${oldData.payment_status}`,
        new_status: `Payment: ${newStatus}`,
        changed_by: "Admin"
      });
    }

    revalidatePath("/admin/bookings");
    revalidatePath(`/admin/bookings/${id}`);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: "Terjadi kesalahan sistem." };
  }
}

export async function updateMultipleBookingsStatus(ids: string[], newStatus: string) {
  try {
    const supabase = await createClient();
    
    const { data: oldRecords } = await supabase.from("bookings").select("id, status").in("id", ids);
    
    const { error } = await supabase
      .from("bookings")
      .update({ status: newStatus })
      .in("id", ids);

    if (error) {
      return { success: false, error: "Gagal memperbarui status massal: " + error.message };
    }

    if (oldRecords && oldRecords.length > 0) {
      const logsToInsert = oldRecords
        .filter((r: any) => r.status !== newStatus)
        .map((r: any) => ({
          booking_id: r.id,
          previous_status: r.status,
          new_status: newStatus,
          changed_by: "Admin"
        }));
        
      if (logsToInsert.length > 0) {
        await supabase.from("booking_status_logs").insert(logsToInsert);
      }
    }

    revalidatePath("/admin/bookings");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: "Terjadi kesalahan sistem." };
  }
}

export async function updateInternalNotes(id: string, notes: string) {
  try {
    const supabase = await createClient();
    
    const { error } = await supabase
      .from("bookings")
      .update({ internal_notes: notes })
      .eq("id", id);

    if (error) {
      return { success: false, error: "Gagal menyimpan catatan: " + error.message };
    }

    revalidatePath(`/admin/bookings/${id}`);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: "Terjadi kesalahan sistem." };
  }
}
