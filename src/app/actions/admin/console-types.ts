"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function createConsoleType(formData: FormData) {
  try {
    const supabase = await createClient();
    
    const code = formData.get("code") as string;
    const name = formData.get("name") as string;
    const imageFile = formData.get("image") as File | null;
    let final_image_url = formData.get("image_url") as string; // For keeping old image url in edit

    if (imageFile && imageFile.size > 0) {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('pasrent-images')
        .upload(fileName, imageFile);

      if (uploadError) {
        return { success: false, error: "Gagal mengunggah gambar: " + uploadError.message };
      }

      const { data: publicUrlData } = supabase.storage
        .from('pasrent-images')
        .getPublicUrl(fileName);
        
      final_image_url = publicUrlData.publicUrl;
    }

    const badge = formData.get("badge") as string;
    const is_featured = formData.get("is_featured") === "true";
    
    // Parse features (newline separated to array)
    const featuresRaw = formData.get("features") as string;
    const features = featuresRaw ? featuresRaw.split('\n').map(f => f.trim()).filter(f => f.length > 0) : [];

    if (!code || !name) {
      return { success: false, error: "Kode dan Nama konsol wajib diisi." };
    }

    const { error } = await supabase.from("console_types").insert({
      code: code.toUpperCase(),
      name,
      image_url: final_image_url || null,
      badge: badge || null,
      is_featured,
      features,
    });

    if (error) {
      if (error.code === '23505') {
        return { success: false, error: "Kode konsol sudah ada. Gunakan kode yang unik." };
      }
      return { success: false, error: "Gagal menyimpan data tipe konsol: " + error.message };
    }

    revalidatePath("/admin/console-types");
    revalidatePath("/konsol");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: "Terjadi kesalahan sistem." };
  }
}

export async function updateConsoleType(id: string, formData: FormData) {
  try {
    const supabase = await createClient();
    
    const code = formData.get("code") as string;
    const name = formData.get("name") as string;
    const imageFile = formData.get("image") as File | null;
    let final_image_url = formData.get("image_url") as string; // The existing image URL or a new one

    if (imageFile && imageFile.size > 0) {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('pasrent-images')
        .upload(fileName, imageFile);

      if (uploadError) {
        return { success: false, error: "Gagal mengunggah gambar: " + uploadError.message };
      }

      const { data: publicUrlData } = supabase.storage
        .from('pasrent-images')
        .getPublicUrl(fileName);
        
      final_image_url = publicUrlData.publicUrl;
    }

    const badge = formData.get("badge") as string;
    const is_featured = formData.get("is_featured") === "true";
    
    const featuresRaw = formData.get("features") as string;
    const features = featuresRaw ? featuresRaw.split('\n').map(f => f.trim()).filter(f => f.length > 0) : [];

    if (!code || !name) {
      return { success: false, error: "Kode dan Nama konsol wajib diisi." };
    }

    const { error } = await supabase.from("console_types").update({
      code: code.toUpperCase(),
      name,
      image_url: final_image_url || null,
      badge: badge || null,
      is_featured,
      features,
    }).eq("id", id);

    if (error) {
      if (error.code === '23505') {
        return { success: false, error: "Kode konsol sudah ada. Gunakan kode yang unik." };
      }
      return { success: false, error: "Gagal menyimpan perubahan: " + error.message };
    }

    revalidatePath("/admin/console-types");
    revalidatePath("/konsol");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: "Terjadi kesalahan sistem." };
  }
}

export async function deleteConsoleType(id: string) {
  try {
    const supabase = await createClient();
    
    const { error } = await supabase.from("console_types").delete().eq("id", id);

    if (error) {
      return { success: false, error: "Gagal menghapus tipe konsol (Mungkin sedang terkait dengan data unit/paket)." };
    }

    revalidatePath("/admin/console-types");
    revalidatePath("/konsol");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: "Terjadi kesalahan sistem." };
  }
}

export async function deleteMultipleConsoleTypes(ids: string[]) {
  try {
    const supabase = await createClient();
    
    const { error } = await supabase.from("console_types").delete().in("id", ids);

    if (error) {
      return { success: false, error: "Gagal menghapus beberapa tipe konsol." };
    }

    revalidatePath("/admin/console-types");
    revalidatePath("/konsol");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: "Terjadi kesalahan sistem." };
  }
}

// Function to fetch console types for customer frontend
export async function getConsoleTypes() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("console_types").select("*").order("code");
  return { success: !error, data: data || [] };
}
