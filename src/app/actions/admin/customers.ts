"use server";

import { createClient } from "@/utils/supabase/server";

export interface CustomerData {
  customer_whatsapp: string;
  customer_name: string;
  customer_email: string | null;
  total_bookings: number;
  total_spent: number;
  last_booking_date: string;
}

export async function getCustomers(): Promise<{ success: boolean; data?: CustomerData[]; error?: string }> {
  try {
    const supabase = await createClient();
    
    // Querying from the PostgreSQL View 'customers_view'
    const { data, error } = await supabase
      .from("customers_view")
      .select("*")
      .order("last_booking_date", { ascending: false });

    if (error) {
      console.error("Error fetching customers view:", error);
      return { success: false, error: "Gagal memuat data pelanggan. Pastikan skrip migrasi view telah dijalankan." };
    }

    return { success: true, data: data as CustomerData[] };
  } catch (error: any) {
    return { success: false, error: "Terjadi kesalahan sistem." };
  }
}
