import { createClient } from "@/utils/supabase/server";
import PackagesClient from "./packages-client";

export default async function AdminPackagesPage() {
  const supabase = await createClient();
  
  // Ambil semua data paket
  const { data: packages } = await supabase
    .from("rental_packages")
    .select("*, console_types(code, name)")
    .order("duration_hours", { ascending: true });

  return <PackagesClient initialPackages={packages || []} />;
}
