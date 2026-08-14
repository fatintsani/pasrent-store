import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { notFound } from "next/navigation";
import { ArrowLeft, CheckCircle2, Clock, MapPin, Ticket, User } from "lucide-react";
import BookingActions from "./booking-actions";

export default async function AdminBookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  // Fetch booking details
  const { data: booking, error: bookingError } = await supabase
    .from("bookings")
    .select("*")
    .eq("id", id)
    .single();

  if (bookingError || !booking) {
    notFound();
  }

  // Fetch booking items
  const { data: items, error: itemsError } = await supabase
    .from("booking_items")
    .select(`
      id,
      start_time,
      end_time,
      subtotal,
      units ( name, type ),
      rental_packages ( name, duration_hours ),
      booking_item_games ( games ( name ) )
    `)
    .eq("booking_id", booking.id);

  return (
    <div className="p-4 md:p-8 w-full mx-auto">
      <div className="mb-6 flex items-center gap-4">
        <Link
          href="/admin/bookings"
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            Detail Pesanan
            <span className={`px-3 py-1 text-sm font-bold rounded-full ${
              booking.status === 'completed' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
              booking.status === 'in_progress' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' :
              booking.status === 'confirmed' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
              booking.status === 'cancelled' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
              'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
            }`}>
              {booking.status.toUpperCase()}
            </span>
          </h1>
          <p className="text-muted-foreground mt-1 font-mono">{booking.booking_code}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Kolom Kiri: Detail Pelanggan & Pembayaran */}
        <div className="space-y-6">
          {/* Card Pelanggan */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-[#5000ef] dark:text-[#00c3cb]" /> Data Pelanggan
            </h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-gray-500 dark:text-gray-400">Nama Lengkap</p>
                <p className="font-semibold text-base">{booking.customer_name}</p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">WhatsApp</p>
                <p className="font-medium">{booking.customer_whatsapp}</p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">Email</p>
                <p className="font-medium">{booking.customer_email || "-"}</p>
              </div>
            </div>
          </div>

          {/* Card Pembayaran */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Ticket className="w-5 h-5 text-[#5000ef] dark:text-[#00c3cb]" /> Pembayaran
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Total Harga</p>
                <p className="font-bold text-2xl text-[#5000ef] dark:text-[#00c3cb]">
                  Rp {booking.total_price.toLocaleString("id-ID")}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Status</span>
                <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${
                  booking.payment_status === 'paid' ? 'bg-green-100 text-green-700' :
                  booking.payment_status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {booking.payment_status.toUpperCase()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Metode</span>
                <span className="font-medium uppercase">{booking.payment_method || "-"}</span>
              </div>
            </div>
          </div>

          {/* Card Pengiriman */}
          {booking.delivery_address && (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#5000ef] dark:text-[#00c3cb]" /> Pengiriman
              </h3>
              <p className="text-sm leading-relaxed">{booking.delivery_address}</p>
            </div>
          )}
        </div>

        {/* Kolom Kanan: Detail Unit yang Disewa */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#5000ef] dark:text-[#00c3cb]" /> Item Sewa
            </h3>
            
            <div className="space-y-4">
              {items?.map((item: any, idx: number) => {
                const startDate = new Date(item.start_time);
                const endDate = new Date(item.end_time);
                const gamesList = item.booking_item_games?.map((g: any) => g.games.name).join(", ");
                
                return (
                  <div key={item.id} className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-100 dark:border-gray-800">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-bold text-lg">Unit {idx + 1}: {item.units.type}</h4>
                        <p className="text-sm text-gray-500">{item.rental_packages.name} ({item.rental_packages.duration_hours} Jam)</p>
                      </div>
                      <span className="font-bold">Rp {item.subtotal.toLocaleString('id-ID')}</span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm mt-4 border-t border-gray-200 dark:border-gray-700 pt-4">
                      <div>
                        <p className="text-gray-500 mb-1 flex items-center gap-1"><Clock className="w-3.5 h-3.5"/> Mulai</p>
                        <p className="font-medium">{format(startDate, "dd MMM yyyy, HH:mm", { locale: localeId })}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 mb-1 flex items-center gap-1"><Clock className="w-3.5 h-3.5"/> Selesai</p>
                        <p className="font-medium">{format(endDate, "dd MMM yyyy, HH:mm", { locale: localeId })}</p>
                      </div>
                    </div>

                    {gamesList && (
                      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 text-sm">
                        <p className="text-gray-500 mb-1">Game yang dipilih:</p>
                        <p className="font-medium leading-relaxed">{gamesList}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          
          <BookingActions booking={booking} />
        </div>
      </div>
    </div>
  );
}
