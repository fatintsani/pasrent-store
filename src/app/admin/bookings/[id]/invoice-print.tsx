import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";

export default function InvoicePrint({ booking, items }: { booking: any; items: any[] }) {
  return (
    <div className="max-w-4xl mx-auto font-sans text-gray-900">
      {/* Header */}
      <div className="flex justify-between items-start border-b-2 border-gray-900 pb-6 mb-6">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 uppercase">INVOICE</h1>
          <p className="text-gray-500 mt-1 font-mono text-sm">{booking.booking_code}</p>
        </div>
        <div className="text-right text-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-1">PASRENT STORE</h2>
          <p className="text-gray-600">Rental PlayStation & Games</p>
          <p className="text-gray-600">Jl. Contoh Alamat No. 123, Kota</p>
          <p className="text-gray-600">Telp: 0812-3456-7890</p>
        </div>
      </div>

      {/* Info & Bill To */}
      <div className="grid grid-cols-2 gap-8 mb-8">
        <div>
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Tagihan Kepada:</h3>
          <p className="font-bold text-lg">{booking.customer_name}</p>
          <p className="text-gray-600">{booking.customer_whatsapp}</p>
          <p className="text-gray-600">{booking.customer_email || "-"}</p>
          {booking.delivery_address && (
            <p className="text-gray-600 mt-2">{booking.delivery_address}</p>
          )}
        </div>
        <div className="text-right">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Tanggal Pesanan:</h3>
            <p className="font-medium">{format(new Date(booking.created_at), "dd MMMM yyyy, HH:mm", { locale: localeId })}</p>
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Status Pembayaran:</h3>
            <p className={`font-bold text-lg uppercase ${booking.payment_status === 'paid' ? 'text-green-600' : 'text-rose-600'}`}>
              {booking.payment_status === 'paid' ? 'LUNAS' : 'BELUM LUNAS'}
            </p>
            {booking.payment_method && (
              <p className="text-sm text-gray-500 uppercase mt-1">Metode: {booking.payment_method}</p>
            )}
          </div>
        </div>
      </div>

      {/* Table Items */}
      <div className="mb-8">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-y-2 border-gray-900 bg-gray-50">
              <th className="py-3 px-4 text-sm font-bold uppercase tracking-wider">Deskripsi Item</th>
              <th className="py-3 px-4 text-sm font-bold uppercase tracking-wider text-right">Durasi / Paket</th>
              <th className="py-3 px-4 text-sm font-bold uppercase tracking-wider text-right">Subtotal</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {items?.map((item, idx) => {
              const gamesList = item.booking_item_games?.map((g: any) => g.games.name).join(", ");
              return (
                <tr key={idx}>
                  <td className="py-4 px-4">
                    <p className="font-bold">{item.units?.type} - Unit Sewa</p>
                    <p className="text-sm text-gray-600 mt-1">
                      Mulai: {format(new Date(item.start_time), "dd/MM/yyyy HH:mm")}<br/>
                      Selesai: {format(new Date(item.end_time), "dd/MM/yyyy HH:mm")}
                    </p>
                    {gamesList && (
                      <p className="text-xs text-gray-500 mt-2 italic">Games: {gamesList}</p>
                    )}
                  </td>
                  <td className="py-4 px-4 text-right align-top">
                    <p className="font-medium">{item.rental_packages?.name}</p>
                    <p className="text-sm text-gray-500">{item.rental_packages?.duration_hours} Jam</p>
                  </td>
                  <td className="py-4 px-4 text-right font-bold align-top">
                    Rp {item.subtotal.toLocaleString('id-ID')}
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-gray-900">
              <td colSpan={2} className="py-4 px-4 text-right font-bold text-lg uppercase">Total Tagihan</td>
              <td className="py-4 px-4 text-right font-extrabold text-2xl">
                Rp {booking.total_price.toLocaleString('id-ID')}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Footer */}
      <div className="mt-16 pt-8 border-t border-gray-200 text-center text-sm text-gray-500">
        <p className="font-bold text-gray-900 mb-1">Terima kasih atas pesanan Anda!</p>
        <p>Invoice ini adalah bukti pembayaran yang sah dan diterbitkan secara elektronik oleh sistem.</p>
      </div>
    </div>
  );
}
