"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function createPackage(formData: FormData) {
  try {
    const supabase = await createClient();
    
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const console_type = formData.get("console_type") as string;
    const duration_hours = parseInt(formData.get("duration_hours") as string, 10);
    const price = parseInt(formData.get("price") as string, 10);

    if (!name || !console_type || isNaN(duration_hours) || isNaN(price)) {
      return { success: false, error: "Semua field yang wajib harus diisi dengan benar." };
    }

    const { error } = await supabase.from("rental_packages").insert({
      name,
      description: description || null,
      console_type,
      duration_hours,
      price,
    });

    if (error) {
      return { success: false, error: "Gagal menyimpan data paket: " + error.message };
    }

    revalidatePath("/admin/packages");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: "Terjadi kesalahan sistem." };
  }
}

export async function updatePackage(id: string, formData: FormData) {
  try {
    const supabase = await createClient();
    
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const console_type = formData.get("console_type") as string;
    const duration_hours = parseInt(formData.get("duration_hours") as string, 10);
    const price = parseInt(formData.get("price") as string, 10);

    if (!name || !console_type || isNaN(duration_hours) || isNaN(price)) {
      return { success: false, error: "Semua field yang wajib harus diisi dengan benar." };
    }

    const { error } = await supabase.from("rental_packages").update({
      name,
      description: description || null,
      console_type,
      duration_hours,
      price,
    }).eq("id", id);

    if (error) {
      return { success: false, error: "Gagal menyimpan perubahan: " + error.message };
    }

    revalidatePath("/admin/packages");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: "Terjadi kesalahan sistem." };
  }
}

export async function deletePackage(id: string) {
  try {
    const supabase = await createClient();
    
    const { error } = await supabase.from("rental_packages").delete().eq("id", id);

    if (error) {
      return { success: false, error: "Gagal menghapus paket (Mungkin sedang digunakan di transaksi)." };
    }

    revalidatePath("/admin/packages");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: "Terjadi kesalahan sistem." };
  }
}
