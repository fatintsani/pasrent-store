import React from "react";

export default function CookiesPage() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-32 pb-20 px-4">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 p-8 md:p-12 rounded-3xl shadow-sm border border-gray-200 dark:border-gray-700">
        <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Kebijakan Cookie</h1>
        <div className="prose dark:prose-invert max-w-none">
          <p>Terakhir diperbarui: {new Date().toLocaleDateString('id-ID')}</p>
          <p>
            Di Pasrent Store, kami menggunakan cookie untuk meningkatkan pengalaman penelusuran Anda.
          </p>
          <h3>1. Apa itu Cookie?</h3>
          <p>
            Cookie adalah file teks kecil yang disimpan di perangkat Anda saat Anda mengunjungi situs web.
            Cookie ini membantu situs web mengingat preferensi Anda.
          </p>
          <h3>2. Bagaimana Kami Menggunakan Cookie?</h3>
          <div>
            <p>Kami menggunakan cookie untuk:</p>
            <ul>
              <li>Mengingat item di keranjang belanja Anda.</li>
              <li>Mempertahankan sesi login Anda.</li>
              <li>Menganalisis traffic situs untuk meningkatkan performa web.</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
