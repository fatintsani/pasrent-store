import React from "react";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-32 pb-20 px-4">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 p-8 md:p-12 rounded-3xl shadow-sm border border-gray-200 dark:border-gray-700">
        <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Kebijakan Privasi</h1>
        <div className="prose dark:prose-invert max-w-none">
          <p>Terakhir diperbarui: {new Date().toLocaleDateString('id-ID')}</p>
          <p>
            Di Pasrent Store, kami sangat menghargai privasi Anda. Kebijakan ini menjelaskan bagaimana kami mengumpulkan,
            menggunakan, dan melindungi informasi pribadi Anda saat Anda menggunakan layanan kami.
          </p>
          <h3>1. Informasi yang Kami Kumpulkan</h3>
          <p>
            Kami dapat mengumpulkan informasi pribadi seperti nama, alamat email, nomor telepon, dan alamat pengiriman saat
            Anda melakukan pemesanan (booking) atau mendaftar di situs kami.
          </p>
          <h3>2. Penggunaan Informasi</h3>
          <p>
            Informasi yang kami kumpulkan digunakan untuk memproses pesanan Anda, mengirimkan pembaruan terkait layanan,
            dan meningkatkan kualitas layanan pelanggan kami.
          </p>
          <h3>3. Perlindungan Data</h3>
          <p>
            Kami menerapkan berbagai langkah keamanan untuk menjaga keamanan informasi pribadi Anda. Informasi sensitif
            seperti rincian pembayaran diproses dengan aman melalui mitra payment gateway kami.
          </p>
        </div>
      </div>
    </main>
  );
}
