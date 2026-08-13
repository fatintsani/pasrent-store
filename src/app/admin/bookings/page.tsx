import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { format } from "date-fns";
import { id } from "date-fns/locale";

export default async function AdminBookingsPage() {
  const supabase = await createClient();
  
  const { data: bookings, error } = await supabase
    .from("bookings")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div className="p-8 text-center text-red-500">
        Error loading bookings: {error.message}
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Kelola Pesanan</h1>
          <p className="text-muted-foreground mt-2">
            Lihat dan kelola semua pesanan sewa konsol.
          </p>
        </div>
        <Link href="/admin/scanner" className="bg-[#5000ef] text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition shadow-sm flex items-center gap-2">
          <i className="bi bi-qr-code-scan"></i> Scan Tiket
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-800 border border-border/50 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 uppercase bg-gray-50 dark:bg-gray-900/50 dark:text-gray-400 border-b border-border/50">
              <tr>
                <th scope="col" className="px-6 py-4">Kode Booking</th>
                <th scope="col" className="px-6 py-4">Pelanggan</th>
                <th scope="col" className="px-6 py-4">Tanggal Pesan</th>
                <th scope="col" className="px-6 py-4">Total Harga</th>
                <th scope="col" className="px-6 py-4">Status Bayar</th>
                <th scope="col" className="px-6 py-4">Status Sewa</th>
                <th scope="col" className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {bookings?.map((booking) => (
                <tr key={booking.id} className="bg-white dark:bg-gray-800 border-b border-border/50 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition">
                  <td className="px-6 py-4 font-medium text-[#5000ef] dark:text-[#00c3cb] whitespace-nowrap">
                    {booking.booking_code}
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-semibold">{booking.customer_name}</div>
                    <div className="text-xs text-gray-500">{booking.customer_whatsapp}</div>
                  </td>
                  <td className="px-6 py-4">
                    {format(new Date(booking.created_at), "dd MMM yyyy HH:mm", { locale: id })}
                  </td>
                  <td className="px-6 py-4 font-medium">
                    Rp {booking.total_price.toLocaleString('id-ID')}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 text-[11px] font-bold rounded-full ${
                      booking.payment_status === 'paid' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                      booking.payment_status === 'pending' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                      'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                      {booking.payment_status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 text-[11px] font-bold rounded-full ${
                      booking.status === 'completed' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                      booking.status === 'in_progress' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' :
                      booking.status === 'confirmed' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                      booking.status === 'cancelled' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                      'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                    }`}>
                      {booking.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link href={`/admin/bookings/${booking.id}`} className="font-medium text-[#5000ef] dark:text-[#00c3cb] hover:underline">
                      Detail
                    </Link>
                  </td>
                </tr>
              ))}
              
              {bookings?.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    Belum ada data pesanan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
