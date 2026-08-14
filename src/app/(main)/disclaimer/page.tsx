import React from "react";

export default function DisclaimerPage() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-32 pb-20 px-4">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 p-8 md:p-12 rounded-3xl shadow-sm border border-gray-200 dark:border-gray-700">
        <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Sanggahan (Disclaimer)</h1>
        <div className="prose dark:prose-invert max-w-none">
          <p>Terakhir diperbarui: {new Date().toLocaleDateString('id-ID')}</p>
          <p>
            Informasi yang disediakan oleh Pasrent Store di situs web ini hanya untuk tujuan informasi umum.
          </p>
          <h3>1. Ketersediaan Produk</h3>
          <p>
            Meskipun kami berupaya sebaik mungkin untuk menjaga agar informasi ketersediaan unit tetap akurat, kami
            tidak dapat menjamin bahwa unit tertentu akan selalu tersedia pada waktu yang Anda inginkan sebelum
            pembayaran dikonfirmasi.
          </p>
          <h3>2. Batasan Tanggung Jawab</h3>
          <p>
            Pasrent Store tidak bertanggung jawab atas kerugian langsung, tidak langsung, insidental, atau
            konsekuensial yang timbul dari penggunaan atau ketidakmampuan menggunakan situs web atau layanan kami.
          </p>
          <h3>3. Tautan Eksternal</h3>
          <p>
            Situs web kami mungkin berisi tautan ke situs web pihak ketiga. Kami tidak memiliki kendali atas konten
            atau praktik privasi situs-situs tersebut dan tidak bertanggung jawab atasnya.
          </p>
        </div>
      </div>
    </main>
  );
}
