"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function createGame(formData: FormData) {
  try {
    const supabase = await createClient();
    
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const cover_url = formData.get("cover_url") as string;
    const is_multiplayer = formData.get("is_multiplayer") === "true";
    
    // Get all supported consoles from checkboxes (e.g. name="supported_consoles" value="PS3")
    const supported_consoles = formData.getAll("supported_consoles") as string[];

    if (!name || supported_consoles.length === 0) {
      return { success: false, error: "Nama game dan minimal satu konsol harus diisi." };
    }

    const { error } = await supabase.from("games").insert({
      name,
      description: description || null,
      cover_url: cover_url || null,
      is_multiplayer,
      supported_consoles,
    });

    if (error) {
      return { success: false, error: "Gagal menyimpan data game: " + error.message };
    }

    revalidatePath("/admin/games");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: "Terjadi kesalahan sistem." };
  }
}

export async function updateGame(id: string, formData: FormData) {
  try {
    const supabase = await createClient();
    
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const cover_url = formData.get("cover_url") as string;
    const is_multiplayer = formData.get("is_multiplayer") === "true";
    
    const supported_consoles = formData.getAll("supported_consoles") as string[];

    if (!name || supported_consoles.length === 0) {
      return { success: false, error: "Nama game dan minimal satu konsol harus diisi." };
    }

    const { error } = await supabase.from("games").update({
      name,
      description: description || null,
      cover_url: cover_url || null,
      is_multiplayer,
      supported_consoles,
    }).eq("id", id);

    if (error) {
      return { success: false, error: "Gagal menyimpan perubahan: " + error.message };
    }

    revalidatePath("/admin/games");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: "Terjadi kesalahan sistem." };
  }
}

export async function deleteGame(id: string) {
  try {
    const supabase = await createClient();
    
    const { error } = await supabase.from("games").delete().eq("id", id);

    if (error) {
      return { success: false, error: "Gagal menghapus game (Mungkin game sedang terkait dengan transaksi)." };
    }

    revalidatePath("/admin/games");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: "Terjadi kesalahan sistem." };
  }
}
