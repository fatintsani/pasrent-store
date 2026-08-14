import { createClient } from "@/utils/supabase/server";
import BookingsClient from "./bookings-client";

export const metadata = {
  title: "Kelola Pesanan - Admin Pasrent Store",
};

export default async function AdminBookingsPage() {
  const supabase = await createClient();
  
  // Ambil semua data pesanan beserta relasi item-itemnya untuk summary di tabel
  const { data: bookings, error } = await supabase
    .from("bookings")
    .select(`
      *,
      booking_items (
        id,
        units ( name, type ),
        rental_packages ( name, duration_hours )
      )
    `)
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div className="p-8 text-center text-red-500 bg-red-50 rounded-2xl border border-red-100 max-w-2xl mx-auto mt-12">
        <h2 className="text-xl font-bold mb-2">Gagal Memuat Data Pesanan</h2>
        <p>Pesan Error: {error.message}</p>
      </div>
    );
  }

  // Render Client Component untuk menangani Interaktivitas (Search, Filter, Sort, Pagination)
  return <BookingsClient initialBookings={bookings || []} />;
}
