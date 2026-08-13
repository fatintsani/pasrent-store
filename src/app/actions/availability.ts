"use server";

import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export async function getBookedIntervals(consoleType: string) {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);

  // Get total units for this console type
  const { data: units, error: unitsError } = await supabase
    .from("units")
    .select("id")
    .eq("type", consoleType)
    .in("status", ["available"]);
    
  if (unitsError || !units) {
    return { success: false, data: [] };
  }
  const totalUnits = units.length;

  if (totalUnits === 0) {
    // If no units available at all, return an infinite blocked interval
    return { success: true, data: [{ startTime: 0, endTime: 9999999999999, unitId: "" }], totalUnits: 0 };
  }

  const today = new Date().toISOString();

  // We fetch bookings for these units via a join
  const { data: bookings, error: bookingsError } = await supabase
    .from("booking_items")
    .select(`
      start_time, 
      end_time,
      unit_id,
      bookings!inner (
        status
      )
    `)
    .in("bookings.status", ["pending", "confirmed", "in_progress"])
    .gte("end_time", today);

  if (bookingsError || !bookings) {
    console.error("Error fetching availability:", bookingsError);
    return { success: false, data: [] };
  }

  // Filter out bookings for units that are not of the requested consoleType
  const unitIds = new Set(units.map(u => u.id));
  const relevantBookings = bookings.filter((b: any) => unitIds.has(b.unit_id));

  return { 
    success: true, 
    data: relevantBookings.map((b: any) => ({
      startTime: new Date(b.start_time).getTime(),
      endTime: new Date(b.end_time).getTime(),
      unitId: b.unit_id
    })),
    units: units.map(u => u.id),
    totalUnits 
  };
}
