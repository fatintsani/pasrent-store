"use server";

import { createClient } from "@/utils/supabase/server";

export type SearchResultItem = {
  id: string;
  type: 'booking' | 'game' | 'unit' | 'package';
  title: string;
  subtitle: string;
  url: string;
};

export async function globalSearch(query: string): Promise<{ success: boolean; data?: SearchResultItem[]; error?: string }> {
  if (!query || query.trim().length < 2) {
    return { success: true, data: [] };
  }

  const supabase = await createClient();
  const searchTerm = `%${query.trim()}%`;

  try {
    const [bookingsRes, gamesRes, unitsRes, packagesRes] = await Promise.all([
      supabase
        .from("bookings")
        .select("id, booking_code, customer_name")
        .or(`booking_code.ilike.${searchTerm},customer_name.ilike.${searchTerm},customer_whatsapp.ilike.${searchTerm}`)
        .limit(5),
      
      supabase
        .from("games")
        .select("id, name, description")
        .ilike("name", searchTerm)
        .limit(5),

      supabase
        .from("units")
        .select("id, name, serial_number")
        .or(`name.ilike.${searchTerm},serial_number.ilike.${searchTerm}`)
        .limit(5),

      supabase
        .from("rental_packages")
        .select("id, name, duration_hours")
        .ilike("name", searchTerm)
        .limit(5),
    ]);

    const results: SearchResultItem[] = [];

    if (bookingsRes.data) {
      bookingsRes.data.forEach(b => {
        results.push({
          id: b.id,
          type: 'booking',
          title: b.customer_name,
          subtitle: `Pesanan: ${b.booking_code}`,
          url: `/admin/bookings/${b.id}`
        });
      });
    }

    if (gamesRes.data) {
      gamesRes.data.forEach(g => {
        results.push({
          id: g.id,
          type: 'game',
          title: g.name,
          subtitle: 'Katalog Game',
          url: `/admin/games/${g.id}/edit`
        });
      });
    }

    if (unitsRes.data) {
      unitsRes.data.forEach(u => {
        results.push({
          id: u.id,
          type: 'unit',
          title: u.name,
          subtitle: u.serial_number ? `SN: ${u.serial_number}` : 'Unit Konsol',
          url: `/admin/units/${u.id}/edit`
        });
      });
    }

    if (packagesRes.data) {
      packagesRes.data.forEach(p => {
        results.push({
          id: p.id,
          type: 'package',
          title: p.name,
          subtitle: `${p.duration_hours} Jam`,
          url: `/admin/packages/${p.id}/edit`
        });
      });
    }

    return { success: true, data: results };
  } catch (error: any) {
    console.error("Global search error:", error);
    return { success: false, error: "Gagal melakukan pencarian" };
  }
}
