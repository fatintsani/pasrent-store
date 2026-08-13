import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pertanyaan Umum (FAQ) - Pasrent Store",
  description: "Informasi seputar syarat dan ketentuan penyewaan di Pasrent Store.",
};

export default function FAQPage() {
  return (
    <main className="min-h-screen pt-24 pb-20 bg-gray-50 dark:bg-[#0d0e11] transition-colors duration-300">

      <section className="py-12 transition-colors duration-300">
        <div className="h-full max-w-4xl mx-auto px-6">
          <div className="flex flex-col gap-12">
            <div>
              <h2 className="font-bold tracking-tighter text-4xl md:text-5xl text-center text-gray-900 dark:text-white">
                Pertanyaan <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5000ef] to-[#00c3cb]">Umum</span>
              </h2>
              <p className="mx-auto mt-4 text-gray-600 dark:text-gray-400 text-center max-w-lg text-lg">
                Informasi seputar syarat dan ketentuan penyewaan di Pasrent Store
              </p>
            </div>
            <div className="flex flex-col mx-auto gap-4 text-base w-full">
              <details className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 cursor-pointer group transition-colors">
                <summary className="font-bold text-lg text-gray-900 dark:text-white outline-none list-none flex justify-between items-center hover:text-[#5000ef] dark:hover:text-[#00c3cb] transition-colors">
                  Apa syarat untuk menyewa PS?
                  <span className="transition group-open:rotate-180 bg-[#5000ef]/5 dark:bg-[#00c3cb]/10 p-2 rounded-full text-[#5000ef] dark:text-[#00c3cb]">
                    <i className="bi bi-chevron-down"></i>
                  </span>
                </summary>
                <div className="pt-4 text-gray-600 dark:text-gray-400 leading-relaxed mt-2 border-t border-gray-100 dark:border-gray-800">
                  Syaratnya sangat mudah! Anda hanya perlu menjaminkan e-KTP asli. Jika Anda adalah pelajar, bisa menggunakan Kartu Pelajar atau KK asli, yang diserahkan saat pengantaran atau pengambilan konsol.
                </div>
              </details>
              <details className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 cursor-pointer group transition-colors">
                <summary className="font-bold text-lg text-gray-900 dark:text-white outline-none list-none flex justify-between items-center hover:text-[#5000ef] dark:hover:text-[#00c3cb] transition-colors">
                  Apakah bisa diantar ke rumah?
                  <span className="transition group-open:rotate-180 bg-[#5000ef]/5 dark:bg-[#00c3cb]/10 p-2 rounded-full text-[#5000ef] dark:text-[#00c3cb]">
                    <i className="bi bi-chevron-down"></i>
                  </span>
                </summary>
                <div className="pt-4 text-gray-600 dark:text-gray-400 leading-relaxed mt-2 border-t border-gray-100 dark:border-gray-800">
                  Tentu bisa! Kami melayani jasa pesan antar untuk wilayah Desa Garawastu, Kecamatan Sindang, Kabupaten Majalengka, dan area sekitarnya. Mungkin terdapat penyesuaian biaya ongkos kirim tergantung jarak rumah Anda.
                </div>
              </details>
              <details className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 cursor-pointer group transition-colors">
                <summary className="font-bold text-lg text-gray-900 dark:text-white outline-none list-none flex justify-between items-center hover:text-[#5000ef] dark:hover:text-[#00c3cb] transition-colors">
                  Bagaimana jika ada kerusakan alat saat disewa?
                  <span className="transition group-open:rotate-180 bg-[#5000ef]/5 dark:bg-[#00c3cb]/10 p-2 rounded-full text-[#5000ef] dark:text-[#00c3cb]">
                    <i className="bi bi-chevron-down"></i>
                  </span>
                </summary>
                <div className="pt-4 text-gray-600 dark:text-gray-400 leading-relaxed mt-2 border-t border-gray-100 dark:border-gray-800">
                  Penyewa bertanggung jawab penuh menjaga unit selama masa sewa. Segala bentuk kerusakan perangkat fisik (seperti stik pecah, mesin tersiram air, dll) akibat kelalaian penyewa akan dikenakan biaya perbaikan sesuai kerusakan.
                </div>
              </details>
              <details className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 cursor-pointer group transition-colors">
                <summary className="font-bold text-lg text-gray-900 dark:text-white outline-none list-none flex justify-between items-center hover:text-[#5000ef] dark:hover:text-[#00c3cb] transition-colors">
                  Apakah boleh diperpanjang (extend) waktu sewanya?
                  <span className="transition group-open:rotate-180 bg-[#5000ef]/5 dark:bg-[#00c3cb]/10 p-2 rounded-full text-[#5000ef] dark:text-[#00c3cb]">
                    <i className="bi bi-chevron-down"></i>
                  </span>
                </summary>
                <div className="pt-4 text-gray-600 dark:text-gray-400 leading-relaxed mt-2 border-t border-gray-100 dark:border-gray-800">
                  Bisa banget! Harap informasikan ke admin melalui WhatsApp minimal 2 jam sebelum waktu sewa habis agar jadwal tidak bentrok dengan antrean penyewa lain. Pembayaran perpanjangan bisa dilakukan melalui transfer.
                </div>
              </details>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
