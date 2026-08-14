import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="px-4 sm:px-8 py-10 sm:py-20 flex flex-col gap-8 sm:gap-12 mt-6 sm:mt-10 relative overflow-hidden transition-colors duration-300">
      <div className="hidden dark:block absolute inset-0 bg-[#0d0e11] -z-10"></div>
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-800 to-transparent"></div>

      <div className="mx-auto max-w-6xl w-full relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 sm:gap-12 lg:gap-8">
          <div className="text-gray-900 dark:text-white">
            <div className="inline-flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
              <Image
                src="/imgs/logo.png"
                alt="Pasrent Store Logo"
                width={64}
                height={64}
                className="h-12 w-12 sm:h-16 sm:w-16 object-cover aspect-square rounded-2xl p-1"
              />
              <p className="text-2xl sm:text-3xl font-bold uppercase tracking-tight">
                Pasrent Store
              </p>
            </div>
            <p className="text-gray-600 dark:text-gray-400 max-w-sm leading-relaxed text-xs sm:text-sm md:text-sm">
              Pusat penyewaan PlayStation 3 dan PlayStation 4 berkualitas di
              Majalengka. Pelayanan ramah, unit terawat, dan harga bersahabat.
            </p>
            <div className="flex gap-3 sm:gap-4 mt-6 sm:mt-8">
              <a
                href="https://instagram.com/pasrent_store"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 flex items-center justify-center hover:bg-gradient-to-r hover:from-[#5000ef] hover:to-[#00c3cb] hover:text-white dark:hover:text-white transition-all text-gray-800 dark:text-white text-lg sm:text-xl"
              >
                <i className="bi bi-instagram"></i>
              </a>
              <a
                href="#"
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 flex items-center justify-center hover:bg-gradient-to-r hover:from-[#5000ef] hover:to-[#00c3cb] hover:text-white dark:hover:text-white transition-all text-gray-800 dark:text-white text-lg sm:text-xl"
              >
                <i className="bi bi-facebook"></i>
              </a>
              <a
                href="https://wa.me/6283133977214"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 flex items-center justify-center hover:bg-gradient-to-r hover:from-[#5000ef] hover:to-[#00c3cb] hover:text-white dark:hover:text-white transition-all text-gray-800 dark:text-white text-lg sm:text-xl"
              >
                <i className="bi bi-whatsapp"></i>
              </a>
            </div>
          </div>

          <div className="text-gray-900 dark:text-white flex flex-col items-start text-start lg:mx-auto">
            <h4 className="font-bold text-lg sm:text-xl mb-4 sm:mb-6 text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-800 pb-2 sm:pb-4 inline-block">
              Tautan Pintas
            </h4>
            <ul className="flex flex-col gap-3 sm:gap-4 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              <li>
                <Link
                  href="/"
                  className="hover:text-[#5000ef] dark:hover:text-[#00c3cb] transition-colors"
                >
                  Beranda
                </Link>
              </li>
              <li>
                <Link
                  href="/konsol"
                  className="hover:text-[#5000ef] dark:hover:text-[#00c3cb] transition-colors"
                >
                  Konsol & Harga
                </Link>
              </li>
              <li>
                <Link
                  href="/booking"
                  className="hover:text-[#5000ef] dark:hover:text-[#00c3cb] transition-colors"
                >
                  Booking
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="hover:text-[#5000ef] dark:hover:text-[#00c3cb] transition-colors"
                >
                  Bantuan (FAQ)
                </Link>
              </li>
              <li>
                <Link
                  href="/cek-pesanan"
                  className="hover:text-[#5000ef] dark:hover:text-[#00c3cb] transition-colors"
                >
                  Lacak Pesanan
                </Link>
              </li>
            </ul>
          </div>

          <div className="text-gray-900 dark:text-white flex flex-col items-start text-start lg:mx-auto">
            <h4 className="font-bold text-lg sm:text-xl mb-4 sm:mb-6 text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-800 pb-2 sm:pb-4 inline-block">
              Kebijakan
            </h4>
            <ul className="flex flex-col gap-3 sm:gap-4 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-[#5000ef] dark:hover:text-[#00c3cb] transition-colors"
                >
                  Kebijakan Privasi
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="hover:text-[#5000ef] dark:hover:text-[#00c3cb] transition-colors"
                >
                  Syarat & Ketentuan
                </Link>
              </li>
              <li>
                <Link
                  href="/cookies"
                  className="hover:text-[#5000ef] dark:hover:text-[#00c3cb] transition-colors"
                >
                  Kebijakan Cookie
                </Link>
              </li>
              <li>
                <Link
                  href="/support"
                  className="hover:text-[#5000ef] dark:hover:text-[#00c3cb] transition-colors"
                >
                  Kebijakan Dukungan
                </Link>
              </li>
              <li>
                <Link
                  href="/licenses"
                  className="hover:text-[#5000ef] dark:hover:text-[#00c3cb] transition-colors"
                >
                  Hak Cipta & Lisensi
                </Link>
              </li>
              <li>
                <Link
                  href="/accessibility"
                  className="hover:text-[#5000ef] dark:hover:text-[#00c3cb] transition-colors"
                >
                  Pernyataan Aksesibilitas
                </Link>
              </li>
              <li>
                <Link
                  href="/disclaimer"
                  className="hover:text-[#5000ef] dark:hover:text-[#00c3cb] transition-colors"
                >
                  Sanggahan
                </Link>
              </li>
            </ul>
          </div>

          <div className="text-gray-900 dark:text-white lg:ml-auto">
            <h4 className="font-bold text-lg sm:text-xl mb-4 sm:mb-6 text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-800 pb-2 sm:pb-4 inline-block">
              Hubungi Kami
            </h4>
            <ul className="flex flex-col gap-3 sm:gap-4 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              <li className="flex items-start gap-2 sm:gap-3">
                <i className="bi bi-geo-alt-fill text-base sm:text-lg text-[#5000ef] dark:text-[#00c3cb] mt-0.5"></i>
                <span className="leading-relaxed">
                  Jalan Alun-alun, Desa Garawastu,
                  <br />
                  Kecamatan Sindang,
                  <br />
                  Kabupaten Majalengka, Jawa Barat.
                </span>
              </li>
              <li className="flex items-center gap-2 sm:gap-3">
                <i className="bi bi-telephone-fill text-base sm:text-lg text-[#5000ef] dark:text-[#00c3cb]"></i>
                <a
                  href="https://wa.me/6283133977214"
                  className="hover:text-[#5000ef] dark:hover:text-[#00c3cb] transition-colors"
                >
                  +62 831-3397-7214
                </a>
              </li>
              <li className="flex items-center gap-2 sm:gap-3">
                <i className="bi bi-envelope-fill text-base sm:text-lg text-[#5000ef] dark:text-[#00c3cb]"></i>
                <a
                  href="mailto:pasrentstore@gmail.com"
                  className="hover:text-[#5000ef] dark:hover:text-[#00c3cb] transition-colors"
                >
                  pasrentstore@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col pt-6 sm:pt-8 mt-10 sm:mt-16 border-t border-gray-200 dark:border-gray-800/50 gap-6">
          <p className="text-center w-full px-4">
            <span className="text-xs sm:text-sm text-gray-500 font-medium">
              © 2026 Pasrent Store. All rights reserved. Develop by{" "}
              <a
                href="https://instagram.com/fatintsani"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#5000ef] dark:hover:text-[#00c3cb]"
              >
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
