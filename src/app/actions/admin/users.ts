"use server";

import { createAdminClient } from "@/utils/supabase/admin";
import { revalidatePath } from "next/cache";

export async function getUsers() {
  try {
    const supabaseAdmin = createAdminClient();
    const { data: { users }, error } = await supabaseAdmin.auth.admin.listUsers();

    if (error) {
      console.error("Error fetching users:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data: users };
  } catch (error: any) {
    if (error.message.includes('SUPABASE_SERVICE_ROLE_KEY')) {
      return { success: false, error: "SUPABASE_SERVICE_ROLE_KEY tidak ditemukan di .env.local. Fitur ini membutuhkan izin Service Role." };
    }
    return { success: false, error: "Terjadi kesalahan saat memuat daftar pengguna." };
  }
}

export async function createUser(formData: FormData) {
  try {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const name = formData.get("name") as string;

    if (!email || !password) {
      return { success: false, error: "Email dan password wajib diisi." };
    }

    if (password.length < 6) {
      return { success: false, error: "Password minimal 6 karakter." };
    }

    const supabaseAdmin = createAdminClient();
    
    // Create the user in auth.users
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        name: name || "Admin"
      }
    });

    if (error) {
      return { success: false, error: "Gagal membuat akun: " + error.message };
    }

    revalidatePath("/admin/users");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: "Terjadi kesalahan sistem." };
  }
}

export async function deleteUser(id: string) {
  try {
    const supabaseAdmin = createAdminClient();
    
    const { error } = await supabaseAdmin.auth.admin.deleteUser(id);

    if (error) {
      return { success: false, error: "Gagal menghapus akun: " + error.message };
    }

    revalidatePath("/admin/users");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: "Terjadi kesalahan sistem." };
  }
}
