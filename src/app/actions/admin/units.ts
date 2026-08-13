"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function createUnit(formData: FormData) {
  try {
    const supabase = await createClient();
    
    const name = formData.get("name") as string;
    const type = formData.get("type") as string;
    const serial_number = formData.get("serial_number") as string;
    const status = formData.get("status") as string;

    if (!name || !type || !status) {
      return { success: false, error: "Semua field yang wajib harus diisi." };
    }

    const { error } = await supabase.from("units").insert({
      name,
      type,
      serial_number: serial_number || null,
      status,
    });

    if (error) {
      return { success: false, error: "Gagal menyimpan data: " + error.message };
    }

    // Refresh admin units page
    revalidatePath("/admin/units");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: "Terjadi kesalahan sistem." };
  }
}

export async function updateUnit(id: string, formData: FormData) {
  try {
    const supabase = await createClient();
    
    const name = formData.get("name") as string;
    const type = formData.get("type") as string;
    const serial_number = formData.get("serial_number") as string;
    const status = formData.get("status") as string;

    if (!name || !type || !status) {
      return { success: false, error: "Semua field yang wajib harus diisi." };
    }

    const { error } = await supabase.from("units").update({
      name,
      type,
      serial_number: serial_number || null,
      status,
    }).eq("id", id);

    if (error) {
      return { success: false, error: "Gagal menyimpan perubahan: " + error.message };
    }

    revalidatePath("/admin/units");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: "Terjadi kesalahan sistem." };
  }
}

export async function deleteUnit(id: string) {
  try {
    const supabase = await createClient();
    
    const { error } = await supabase.from("units").delete().eq("id", id);

    if (error) {
      return { success: false, error: "Gagal menghapus unit (Mungkin unit sedang disewa)." };
    }

    revalidatePath("/admin/units");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: "Terjadi kesalahan sistem." };
  }
}
