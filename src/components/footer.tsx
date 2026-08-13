import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="px-8 py-20 flex flex-col gap-12 mt-10 relative overflow-hidden transition-colors duration-300">
      <div className="hidden dark:block absolute inset-0 bg-[#0d0e11] -z-10"></div>
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-800 to-transparent"></div>

      <div className="mx-auto max-w-6xl w-full relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-16 md:gap-12">
          <div className="text-gray-900 dark:text-white">
            <div className="inline-flex items-center gap-4 mb-6">
              <Image
                src="/imgs/logo.png"
                alt="Pasrent Store Logo"
                width={64}
                height={64}
                className="h-16 w-16 object-cover aspect-square rounded-2xl p-1"
              />
              <p className="text-3xl font-bold uppercase tracking-tight">Pasrent Store</p>
            </div>
            <p className="text-gray-600 dark:text-gray-400 max-w-sm leading-relaxed text-lg">
              Pusat penyewaan PlayStation 3 dan PlayStation 4 berkualitas di Majalengka. Pelayanan ramah, unit terawat, dan harga bersahabat.
            </p>
            <div className="flex gap-4 mt-8">
              <a
                href="https://instagram.com/pasrent_store"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 flex items-center justify-center hover:bg-gradient-to-r hover:from-[#5000ef] hover:to-[#00c3cb] hover:text-white dark:hover:text-white transition-all text-gray-800 dark:text-white text-xl"
              >
                <i className="bi bi-instagram"></i>
              </a>
              <a
                href="#"
                className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 flex items-center justify-center hover:bg-gradient-to-r hover:from-[#5000ef] hover:to-[#00c3cb] hover:text-white dark:hover:text-white transition-all text-gray-800 dark:text-white text-xl"
              >
                <i className="bi bi-facebook"></i>
              </a>
              <a
                href="https://wa.me/6283133977214"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 flex items-center justify-center hover:bg-gradient-to-r hover:from-[#5000ef] hover:to-[#00c3cb] hover:text-white dark:hover:text-white transition-all text-gray-800 dark:text-white text-xl"
              >
                <i className="bi bi-whatsapp"></i>
              </a>
            </div>
          </div>

          <div className="text-gray-900 dark:text-white flex flex-col items-start text-start md:mx-auto">
            <h4 className="font-bold text-xl mb-6 text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-800 pb-4 inline-block">
              Tautan Pintas
            </h4>
            <ul className="flex flex-col gap-4 text-base text-gray-600 dark:text-gray-400">
              <li><Link href="/" className="hover:text-[#5000ef] dark:hover:text-[#00c3cb] transition-colors">Beranda</Link></li>
              <li><Link href="/konsol" className="hover:text-[#5000ef] dark:hover:text-[#00c3cb] transition-colors">Konsol & Harga</Link></li>
              <li><Link href="/booking" className="hover:text-[#5000ef] dark:hover:text-[#00c3cb] transition-colors">Booking</Link></li>
              <li><Link href="/faq" className="hover:text-[#5000ef] dark:hover:text-[#00c3cb] transition-colors">Bantuan (FAQ)</Link></li>
              <li><Link href="/cek-pesanan" className="hover:text-[#5000ef] dark:hover:text-[#00c3cb] transition-colors">Lacak Pesanan</Link></li>
            </ul>
          </div>

          <div className="text-gray-900 dark:text-white md:ml-auto">
            <h4 className="font-bold text-xl mb-6 text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-800 pb-4 inline-block">
              Hubungi Kami
            </h4>
            <ul className="flex flex-col gap-6 text-base text-gray-600 dark:text-gray-400">
              <li className="flex items-start gap-4">
                <div className="p-3 rounded-xl text-[#5000ef] dark:text-[#00c3cb]">
                  <i className="bi bi-geo-alt-fill text-xl"></i>
                </div>
                <span className="mt-1 leading-relaxed">
                  Jalan Alun-alun, Desa Garawastu,<br />
                  Kecamatan Sindang,<br />
                  Kabupaten Majalengka, Jawa Barat.
                </span>
              </li>
              <li className="flex items-center gap-4">
                <div className="p-3 rounded-xl text-[#5000ef] dark:text-[#00c3cb]">
                  <i className="bi bi-telephone-fill text-xl"></i>
                </div>
                <a
                  href="https://wa.me/6283133977214"
                  className="hover:text-[#5000ef] dark:hover:text-[#00c3cb] transition-colors font-semibold text-lg"
                >
                  +62 831-3397-7214
                </a>
              </li>
              <li className="flex items-center gap-4">
                <div className="p-3 rounded-xl text-[#5000ef] dark:text-[#00c3cb]">
                  <i className="bi bi-envelope-fill text-xl"></i>
                </div>
                <a
                  href="mailto:pasrentstore@gmail.com"
                  className="hover:text-[#5000ef] dark:hover:text-[#00c3cb] transition-colors font-medium"
                >
                  pasrentstore@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col pt-8 mt-16 border-t border-gray-200 dark:border-gray-800/50">
          <p className="text-center w-full">
            <span className="text-sm text-gray-500 font-medium">
              © 2026 Pasrent Store. All rights reserved. Develop by{" "}
              <a href="https://instagram.com/fatintsani" target="_blank" rel="noopener noreferrer" className="hover:text-[#5000ef] dark:hover:text-[#00c3cb]">
                @fatintsani
              </a>
              .
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}
