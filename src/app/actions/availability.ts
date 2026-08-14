"use server";

import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export async function getBookedIntervals(consoleType: string) {
  const supabase = await createClient();

  // Get total units for this console type
  const { data: allUnits, error: unitsError } = await supabase
    .from("units")
    .select(`
      id,
      type,
      console_types (
        code
      )
    `)
    .in("status", ["available"]);
    
  if (unitsError || !allUnits) {
    return { success: false, data: [] };
  }

  // Filter units matching the consoleType (handling both legacy type and console_types.code)
  const units = allUnits.filter((u: any) => {
    const rawCode = u.console_types?.code || u.type;
    let normCode = rawCode;
    if (rawCode === 'CONSOLE-PS4') normCode = 'PS4';
    if (rawCode === 'CONSOLE-PS3') normCode = 'PS3';
    
    let targetCode = consoleType;
    if (consoleType === 'CONSOLE-PS4') targetCode = 'PS4';
    if (consoleType === 'CONSOLE-PS3') targetCode = 'PS3';
    
    return normCode === targetCode;
  });

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
