import React from "react";

export default function SupportPage() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-32 pb-20 px-4">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 p-8 md:p-12 rounded-3xl shadow-sm border border-gray-200 dark:border-gray-700">
        <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Kebijakan Dukungan</h1>
        <div className="prose dark:prose-invert max-w-none">
          <p>Terakhir diperbarui: {new Date().toLocaleDateString('id-ID')}</p>
          <p>
            Kami berkomitmen untuk memberikan dukungan terbaik kepada semua pelanggan Pasrent Store.
          </p>
          <h3>1. Jam Operasional Dukungan</h3>
          <p>
            Tim dukungan kami tersedia untuk membantu Anda selama jam kerja: Senin - Minggu (08:00 - 22:00 WIB).
          </p>
          <h3>2. Saluran Dukungan</h3>
          <div>
            <p>Anda dapat menghubungi kami melalui:</p>
            <ul>
              <li>WhatsApp: +62 831-3397-7214</li>
              <li>Email: pasrentstore@gmail.com</li>
            </ul>
          </div>
          <h3>3. Kendala Teknis</h3>
          <p>
            Jika Anda mengalami kendala teknis pada konsol yang disewa, segera hubungi kami. Kami akan memberikan
            panduan atau mengganti unit jika kerusakan bukan disebabkan oleh kelalaian penyewa.
          </p>
        </div>
      </div>
    </main>
  );
}
