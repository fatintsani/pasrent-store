import React from "react";

export default function AccessibilityPage() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-32 pb-20 px-4">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 p-8 md:p-12 rounded-3xl shadow-sm border border-gray-200 dark:border-gray-700">
        <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Pernyataan Aksesibilitas</h1>
        <div className="prose dark:prose-invert max-w-none">
          <p>Terakhir diperbarui: {new Date().toLocaleDateString('id-ID')}</p>
          <p>
            Pasrent Store berkomitmen untuk memastikan bahwa situs web kami dapat diakses oleh semua orang,
            termasuk individu dengan disabilitas.
          </p>
          <h3>1. Komitmen Kami</h3>
          <p>
            Kami terus berusaha untuk meningkatkan pengalaman pengguna bagi semua orang dan menerapkan standar
            aksesibilitas web yang relevan, seperti memberikan kontras warna yang baik dan fitur dukungan navigasi.
          </p>
          <h3>2. Masukan Anda</h3>
          <p>
            Jika Anda mengalami kesulitan dalam mengakses bagian mana pun dari situs web kami, jangan ragu untuk
            menghubungi kami. Umpan balik Anda sangat berharga bagi kami untuk terus meningkatkan layanan.
          </p>
        </div>
      </div>
    </main>
  );
}
