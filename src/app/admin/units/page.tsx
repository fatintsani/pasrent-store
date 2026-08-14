import { createClient } from "@/utils/supabase/server";
import UnitsClient from "./units-client";

export default async function AdminUnitsPage() {
  const supabase = await createClient();
  
  // Ambil semua data unit
  const { data: units } = await supabase
    .from("units")
    .select("*, console_types(code, name)")
    .order("created_at", { ascending: false });

  return <UnitsClient initialUnits={units || []} />;
}
