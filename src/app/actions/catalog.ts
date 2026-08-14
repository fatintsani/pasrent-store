"use server";

import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export async function getGames() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("games").select(`
    *,
    console_types (
      code,
      name
    )
  `).order("name");

  if (error) return { success: false, data: [] };

  const formattedGames = data.map((game: any) => {
    let consoles: string[] = [];
    const rawCode = game.console_types?.code || game.console_type;
    
    // Normalize code to handle cases like "CONSOLE-PS4", "CONSOLE-PS3"
    let code = rawCode;
    if (rawCode === 'CONSOLE-PS4') code = 'PS4';
    if (rawCode === 'CONSOLE-PS3') code = 'PS3';
    if (rawCode === 'CONSOLE-ALL') code = 'ALL';

    if (code === 'ALL') {
      consoles = ['PS3', 'PS4'];
    } else if (code) {
      consoles = [code];
    }

    return {
      ...game,
      supported_consoles: consoles
    };
  });

  return { success: true, data: formattedGames };
}

export async function getPackages() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("rental_packages").select(`
    *,
    console_types (
      code,
      name
    )
  `).order("duration_hours");

  if (error) return { success: false, data: [] };

  const formattedPackages = data.map((pkg: any) => {
    const rawCode = pkg.console_types?.code || pkg.console_type;
    
    // Normalize code
    let code = rawCode;
    if (rawCode === 'CONSOLE-PS4') code = 'PS4';
    if (rawCode === 'CONSOLE-PS3') code = 'PS3';
    if (rawCode === 'CONSOLE-ALL') code = 'ALL';

    return {
      ...pkg,
      console_type: code
    };
  });

  return { success: true, data: formattedPackages };
}
