"use server";

import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export async function getGames() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("games").select("*").order("name");
  return { success: !error, data: data || [] };
}

export async function getPackages() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("rental_packages").select("*").order("duration_hours");
  return { success: !error, data: data || [] };
}
