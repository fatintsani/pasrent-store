"use server";

import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export async function submitBooking(formData: FormData) {
  try {
    const nama = formData.get("nama")?.toString();
    const whatsapp = formData.get("whatsapp")?.toString();
    const email = formData.get("email")?.toString();
    const alamat = formData.get("alamat")?.toString();
    
    // We expect the frontend to pass a JSON string of the cart items
    const cartStr = formData.get("cart")?.toString();

    if (!nama || !whatsapp || !cartStr) {
      return { success: false, error: "Data pelanggan atau keranjang tidak valid." };
    }

    let cartItems: any[];
    try {
      cartItems = JSON.parse(cartStr);
    } catch(e) {
      return { success: false, error: "Format keranjang salah." };
    }

    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      return { success: false, error: "Keranjang kosong." };
    }

    const supabase = await createClient();

    // Calculate total price
    let totalPrice = 0;
    cartItems.forEach(item => {
      totalPrice += item.subtotal || 0;
    });

    const bookingCode = `BKG-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-${Math.floor(1000 + Math.random() * 9000)}`;

    const bookingData = {
      booking_code: bookingCode,
      customer_name: nama,
      customer_whatsapp: whatsapp,
      customer_email: email || null,
      delivery_address: alamat || null,
      total_price: totalPrice,
      payment_method: 'transfer',
      payment_status: 'pending',
      status: 'pending',
    };

    // Insert Booking Header
    const { data: booking, error: bookingError } = await supabase
      .from("bookings")
      .insert([bookingData])
      .select()
      .single();

    if (bookingError) {
      console.error("Booking Error:", bookingError);
      return { success: false, error: `Error DB (Header): ${bookingError.message}` };
    }

    // Insert Booking Items
    for (const item of cartItems) {
      const { data: bookingItem, error: itemError } = await supabase
        .from("booking_items")
        .insert([{
          booking_id: booking.id,
          unit_id: item.unitId,
          rental_package_id: item.packageId,
          start_time: item.startTime,
          end_time: item.endTime,
          subtotal: item.subtotal
        }])
        .select()
        .single();

      if (itemError) {
        console.error("Booking Item Error:", itemError);
        continue;
      }

      // Insert Games for this item
      if (item.gameIds && Array.isArray(item.gameIds) && item.gameIds.length > 0) {
        const gameInserts = item.gameIds.map((gameId: string) => ({
          booking_item_id: bookingItem.id,
          game_id: gameId
        }));
        await supabase.from("booking_item_games").insert(gameInserts);
      }
    }

    // Send Email
    if (email) {
      import('@/lib/email').then(({ sendBookingEmail }) => {
        sendBookingEmail(email.toString(), bookingData, cartItems).catch(console.error);
      });
    }

    return { success: true, bookingCode: booking.booking_code };
  } catch (err: any) {
    console.error("Submit Booking Error:", err);
    return { success: false, error: err.message || "Unknown error occurred" };
  }
}
