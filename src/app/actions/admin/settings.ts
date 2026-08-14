"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function getSettings() {
  const supabase = await createClient();
  try {
    const { data, error } = await supabase
      .from("system_settings")
      .select("*");
      
    if (error) {
      if (error.code === '42P01') {
        // Table doesn't exist yet, return dummy defaults
        return {
          success: true,
          data: {
            app_mode: "development",
            maintenance_mode: false,
            smtp_config: { host: "", port: "465", user: "", pass: "", from: "" }
          }
        };
      }
      throw error;
    }

    const settingsObj: any = {};
    if (data) {
      data.forEach(item => {
        settingsObj[item.key] = item.value;
      });
    }

    return { success: true, data: settingsObj };
  } catch (error: any) {
    console.error("Error fetching settings:", error);
    return { success: false, error: error.message };
  }
}

export async function updateSetting(key: string, value: any) {
  const supabase = await createClient();
  try {
    const { error } = await supabase
      .from("system_settings")
      .upsert({
        key,
        value
      }, { onConflict: 'key' });

    if (error) throw error;
    
    revalidatePath("/admin/settings");
    return { success: true };
  } catch (error: any) {
    console.error("Error updating setting:", error);
    return { success: false, error: error.message };
  }
}

export async function updateMultipleSettings(settings: Record<string, any>) {
  const supabase = await createClient();
  try {
    const updates = Object.entries(settings).map(([key, value]) => ({
      key,
      value
    }));

    const { error } = await supabase
      .from("system_settings")
      .upsert(updates, { onConflict: 'key' });

    if (error) throw error;

    revalidatePath("/admin/settings");
    return { success: true };
  } catch (error: any) {
    console.error("Error updating multiple settings:", error);
    return { success: false, error: error.message };
  }
}
