import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import Link from "next/link";
import InvoicePrint from "@/app/admin/bookings/[id]/invoice-print";
import PrintButton from "@/app/admin/bookings/[id]/print-button";
import CheckStatusButton from "@/components/check-status-button";

export default async function TicketPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const cookieStore = await cookies();
  const supabase = await createClient();

  // Fetch the booking header
  const { data: booking, error: bookingError } = await supabase
    .from("bookings")
    .select("*")
    .eq("booking_code", code)
    .single();

  if (bookingError || !booking) {
    console.error("Booking Error:", bookingError);
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl text-center border border-gray-200 dark:border-gray-700 max-w-md w-full">
          <i className="bi bi-x-circle text-6xl text-red-500 mb-4 inline-block"></i>
          <h2 className="text-2xl font-bold mb-2">Tiket Tidak Ditemukan</h2>
          <p className="text-gray-500 mb-6">
            Kode booking tidak valid atau tidak ditemukan.
          </p>
          <Link
            href="/"
            className="px-6 py-3 bg-[#5000ef] text-white rounded-xl font-bold"
          >
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    );
  }

  // Fetch the booking items
  const { data: items, error: itemsError } = await supabase
    .from("booking_items")
    .select(
      `
      id,
      start_time,
      end_time,
      subtotal,
      units ( name, type ),
      rental_packages ( name ),
      booking_item_games ( games ( name ) )
    `,
    )
    .eq("booking_id", booking.id);

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${booking.booking_code}&margin=10`;

  return (
    <>
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 print:hidden">
        <div className="max-w-3xl mx-auto flex flex-col gap-8">
          {/* Ticket Header */}
          <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] mt-18 p-8 md:p-12 border border-gray-200 dark:border-gray-700 flex flex-col md:flex-row items-center gap-10">
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
                <div
                  className={`inline-block px-4 py-1.5 rounded-full font-bold text-sm ${booking.status === "pending" ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"}`}
                >
                  Status: {booking.status.toUpperCase()}
                </div>
                {booking.status === "pending" &&
                  booking.payment_method !== "cod" && (
                    <CheckStatusButton bookingCode={booking.booking_code} />
                  )}
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white mb-2">
                E-Ticket Pasrent
              </h1>
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                Hai, {booking.customer_name}
              </p>
              <div className="mt-6">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Kode Booking
                </span>
                <p className="text-2xl font-bold text-[#5000ef] dark:text-[#00c3cb]">
                  {booking.booking_code}
                </p>
              </div>
            </div>
            <div className="bg-white p-4 rounded-3xl border border-gray-100 shrink-0 relative z-0">
              {/* Skeleton Placeholder */}
              <div className="absolute top-4 left-4 w-[200px] h-[200px] bg-gray-200 animate-pulse rounded-xl -z-10" />

              <img
                src={qrCodeUrl}
                alt={`QR Code ${booking.booking_code}`}
                width={200}
                height={200}
                className="rounded-xl relative"
                loading="lazy"
              />
              <p className="text-center text-xs text-gray-500 mt-3 font-medium">
                Scan untuk Check-in
              </p>
            </div>
          </div>

          {/* Order Details */}
          <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] p-8 md:p-12 border border-gray-200 dark:border-gray-700">
            <h3 className="text-2xl font-bold mb-6 border-b border-gray-100 dark:border-gray-700 pb-4">
              Detail Pesanan
            </h3>

            <div className="flex flex-col gap-6">
              {items?.map((item: any, idx: number) => {
                const startDate = new Date(item.start_time);
                const endDate = new Date(item.end_time);
                const gamesList = item.booking_item_games
                  ?.map((g: any) => g.games.name)
                  .join(", ");

                return (
                  <div
                    key={item.id}
                    className="p-6 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-800"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-bold text-xl text-gray-900 dark:text-white">
                          Unit {idx + 1}: {item.units.type} (
                          {item.rental_packages.name})
                        </h4>
                        <p className="text-sm text-gray-500 mt-1">
                          Sistem akan memilihkan unit terbaik secara otomatis.
                        </p>
                      </div>
                      <span className="font-bold text-[#5000ef] dark:text-[#00c3cb]">
                        Rp {item.subtotal.toLocaleString("id-ID")}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm mt-4">
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                        <i className="bi bi-calendar-event text-lg text-gray-400"></i>
                        <span>
                          {format(startDate, "dd MMMM yyyy", { locale: id })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                        <i className="bi bi-clock text-lg text-gray-400"></i>
                        <span>
                          {format(startDate, "HH:mm")} -{" "}
                          {format(endDate, "HH:mm")}
                        </span>
                      </div>
                      {gamesList && (
                        <div className="flex items-start gap-2 text-gray-600 dark:text-gray-300 sm:col-span-2 mt-2">
                          <i className="bi bi-controller text-lg text-gray-400"></i>
                          <span>
                            <strong>Games:</strong> {gamesList}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="text-gray-500 text-sm">
                <p>WhatsApp: {booking.customer_whatsapp}</p>
                {booking.delivery_address && (
                  <p>Alamat: {booking.delivery_address}</p>
                )}
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <PrintButton />
                <Link
                  href="/"
                  className="px-6 py-2 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-bold rounded-xl hover:bg-gray-200 transition text-center flex-1 sm:flex-none"
                >
                  Beranda
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Tampilan Cetak (Hanya muncul saat di-print) */}
      <div className="hidden print:block p-8 bg-white text-black w-full min-h-screen">
        <InvoicePrint booking={booking} items={items || []} />
      </div>
    </>
  );
}
