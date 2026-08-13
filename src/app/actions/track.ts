"use server";

import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export async function trackBooking(trackingId: string) {
  try {
    if (!trackingId || trackingId.trim() === "") {
      return { success: false, error: "ID Pelacakan tidak valid." };
    }

    const cookieStore = await cookies();
    const supabase = await createClient(cookieStore);

    const { data, error } = await supabase
      .from("pesanan_sewa")
      .select("*")
      .eq("id", trackingId)
      .single();

    if (error || !data) {
      return { success: false, error: "Pesanan tidak ditemukan. Periksa kembali ID Pelacakan Anda." };
    }

    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: "Format ID Pelacakan tidak valid." };
  }
}
