import React from "react";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-32 pb-20 px-4">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 p-8 md:p-12 rounded-3xl shadow-sm border border-gray-200 dark:border-gray-700">
        <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Syarat & Ketentuan</h1>
        <div className="prose dark:prose-invert max-w-none">
          <p>Terakhir diperbarui: {new Date().toLocaleDateString('id-ID')}</p>
          <p>
            Harap baca Syarat dan Ketentuan ini dengan saksama sebelum menggunakan layanan Pasrent Store.
            Dengan melakukan pemesanan, Anda menyetujui persyaratan di bawah ini.
          </p>
          <h3>1. Pemesanan dan Pembayaran</h3>
          <p>
            Semua pemesanan harus dilakukan melalui sistem website kami. Pembayaran dapat dilakukan secara tunai (COD)
            atau menggunakan metode pembayaran online (Midtrans).
          </p>
          <h3>2. Tanggung Jawab Penyewa</h3>
          <p>
            Penyewa bertanggung jawab penuh atas konsol dan aksesoris selama masa sewa. Kerusakan atau kehilangan
            akan dikenakan biaya penggantian sesuai dengan nilai barang.
          </p>
          <h3>3. Keterlambatan Pengembalian</h3>
          <p>
            Pengembalian yang melewati batas waktu sewa akan dikenakan denda sesuai dengan tarif per jam yang berlaku.
          </p>
        </div>
      </div>
    </main>
  );
}
