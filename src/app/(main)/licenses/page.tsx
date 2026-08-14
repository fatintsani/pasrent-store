import React from "react";

export default function LicensesPage() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-32 pb-20 px-4">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 p-8 md:p-12 rounded-3xl shadow-sm border border-gray-200 dark:border-gray-700">
        <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Hak Cipta & Lisensi</h1>
        <div className="prose dark:prose-invert max-w-none">
          <p>Terakhir diperbarui: {new Date().toLocaleDateString('id-ID')}</p>
          <p>
            Semua konten yang terdapat dalam situs web Pasrent Store, termasuk namun tidak terbatas pada teks,
            grafik, logo, dan gambar, dilindungi oleh hak cipta dan hukum kekayaan intelektual lainnya.
          </p>
          <h3>1. Kepemilikan Konten</h3>
          <p>
            Nama dan logo Pasrent Store adalah milik Pasrent Store. Penggunaan tanpa izin tertulis dari kami
            sangat dilarang.
          </p>
          <h3>2. Lisensi Pihak Ketiga</h3>
          <p>
            Beberapa aset (seperti ikon dan gambar produk konsol) mungkin merupakan hak cipta dari masing-masing
            pemilik merek dagang (seperti Sony PlayStation). Kami menggunakannya semata-mata untuk tujuan
            representasi visual produk yang kami sewakan.
          </p>
        </div>
      </div>
    </main>
  );
}
