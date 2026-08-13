import Image from "next/image";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Home() {
  return (
    <>
      <main>
        <section
          id="home"
          className="px-8 pt-36 pb-20 relative items-center overflow-hidden transition-colors duration-300"
        >
          <div className="flex flex-col gap-6 items-center mx-auto w-full max-w-5xl">
            <div className="flex gap-4 items-center bg-gray-100 dark:bg-gray-900 py-2 px-4 rounded-full border border-gray-200 dark:border-gray-800 transition-colors">
              <span className="text-xs font-semibold tracking-wide text-gray-700 dark:text-gray-300">
                RENTAL PS TERPERCAYA DI MAJALENGKA
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-center leading-tight text-gray-900 dark:text-white transition-colors">
              Sewa PS3 & PS4
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5000ef] to-[#00c3cb]">
                Mudah & Terjangkau.
              </span>
            </h1>
            <p className="font-normal text-lg md:text-xl text-center text-gray-600 dark:text-gray-400 mt-2 max-w-2xl transition-colors">
              Mainkan game-game favoritmu di rumah tanpa harus beli konsol.
              <br />
              Layanan antar jemput tersedia untuk area Majalengka dan
              sekitarnya!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <a
                href="/konsol"
                className="cursor-pointer bg-gradient-to-r from-[#5000ef] to-[#00c3cb] text-white px-8 py-3.5 rounded-xl font-bold hover:opacity-90 transition-all shadow-lg shadow-[#5000ef]/20 dark:shadow-[0_0_20px_rgba(80,0,239,0.3)] text-center"
              >
                Lihat Daftar Harga
              </a>
              <a
                href="/booking"
                className="cursor-pointer border border-gray-300 dark:border-gray-600 bg-transparent text-gray-900 dark:text-white px-8 py-3.5 rounded-xl font-bold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-center flex items-center justify-center gap-2"
              >
                <i className="bi bi-whatsapp text-[#00c3cb]"></i> Pesan Sekarang
              </a>
            </div>
          </div>
        </section>

        <section
          id="features"
          className="px-8 py-24 bg-gray-50 dark:bg-gray-900/40 rounded-[3rem] mx-2 md:mx-6 my-10 transition-colors duration-300"
        >
          <div className="flex flex-col gap-16 items-center mx-auto w-full max-w-6xl">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter text-center text-gray-900 dark:text-white">
              Kenapa Memilih
              <br />
              Pasrent Store?
            </h2>
            <div className="flex flex-col md:grid grid-cols-2 gap-6 w-full">
              <div className="col-span-1 flex flex-col gap-4 items-start bg-white dark:bg-gray-900 rounded-3xl p-10 shadow-sm border border-gray-200 dark:border-gray-800 hover:shadow-md transition-all">
                <div className="bg-[#5000ef]/10 dark:bg-[#00c3cb]/10 p-4 rounded-2xl text-[#5000ef] dark:text-[#00c3cb] mb-2">
                  <i className="bi bi-controller text-4xl"></i>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Kondisi Mesin Prima
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  Unit PS3 dan PS4 yang kami sewakan selalu dirawat dan
                  dipastikan dalam kondisi terbaik agar pengalaman bermain game
                  Anda tidak terganggu, mesin adem dan tidak bising.
                </p>
              </div>
              <div className="col-span-1 flex flex-col gap-4 items-start bg-white dark:bg-gray-900 rounded-3xl p-10 shadow-sm border border-gray-200 dark:border-gray-800 hover:shadow-md transition-all">
                <div className="bg-[#5000ef]/10 dark:bg-[#00c3cb]/10 p-4 rounded-2xl text-[#5000ef] dark:text-[#00c3cb] mb-2">
                  <i className="bi bi-disc text-4xl"></i>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Game Update Terbaru
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  Daftar game yang kami sediakan selalu diperbarui secara
                  berkala. Mulai dari game bola terbaru (PES/FIFA), petualangan
                  epik, hingga game keluarga untuk dimainkan bersama.
                </p>
              </div>
              <div className="col-span-2 flex flex-col md:flex-row gap-8 items-center bg-gray-900 dark:bg-black text-white rounded-3xl p-10 md:p-16 shadow-lg relative overflow-hidden border border-gray-800">
                <div className="absolute -right-20 -top-20 opacity-10">
                  <i className="bi bi-truck text-[20rem]"></i>
                </div>
                <div className="flex-1 z-10">
                  <div className="bg-gradient-to-r from-[#5000ef] to-[#00c3cb] text-white inline-block p-3 rounded-2xl mb-6">
                    <i className="bi bi-truck text-3xl"></i>
                  </div>
                  <h3 className="text-3xl md:text-4xl font-bold mb-4">
                    Layanan Antar Jemput
                  </h3>
                  <p className="text-gray-300 dark:text-gray-400 text-lg max-w-xl leading-relaxed">
                    Tidak perlu repot keluar rumah, kami menyediakan layanan
                    antar jemput unit untuk wilayah Desa Garawastu, Kecamatan
                    Sindang, Majalengka dan sekitarnya. Cukup hubungi via
                    WhatsApp, konsol siap dimainkan!
                  </p>
                  <a
                    href="https://wa.me/6283133977214"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-8 bg-white px-8 py-3.5 text-[#5000ef] font-bold rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    Cek Area Pengiriman
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="px-8 py-12 transition-colors duration-300">
          <div className="flex flex-col gap-12 items-center mx-auto w-full max-w-5xl">
            <div className="text-center">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tighter text-gray-900 dark:text-white">
                Kelengkapan{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5000ef] to-[#00c3cb]">
                  Sewa
                </span>
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-4 max-w-lg mx-auto">
                Setiap penyewaan sudah termasuk paket lengkap berikut, siap
                pasang dan main.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-4 w-full">
              <div className="flex w-full max-w-[140px] flex-col gap-4 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 items-center bg-gray-50 dark:bg-gray-900/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-white">
                <i className="bi bi-tv text-4xl text-gray-400 dark:text-gray-500"></i>
                <span className="text-center font-medium text-sm">
                  Kabel HDMI
                </span>
              </div>
              <div className="flex w-full max-w-[140px] flex-col gap-4 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 items-center bg-gray-50 dark:bg-gray-900/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-white">
                <i className="bi bi-usb-symbol text-4xl text-gray-400 dark:text-gray-500"></i>
                <span className="text-center font-medium text-sm">
                  Kabel Charger
                </span>
              </div>
              <div className="flex w-full max-w-[150px] flex-col gap-4 p-6 rounded-2xl border border-transparent items-center bg-gradient-to-br from-[#5000ef] to-[#00c3cb] text-white transform scale-105 shadow-lg shadow-[#5000ef]/30 dark:shadow-[0_0_30px_rgba(0,195,203,0.2)]">
                <i className="bi bi-controller text-5xl"></i>
                <span className="text-center font-bold text-base">
                  2 Stik
                  <br />
                  Original
                </span>
              </div>
              <div className="flex w-full max-w-[140px] flex-col gap-4 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 items-center bg-gray-50 dark:bg-gray-900/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-white">
                <i className="bi bi-plug text-4xl text-gray-400 dark:text-gray-500"></i>
                <span className="text-center font-medium text-sm">
                  Kabel Power
                </span>
              </div>
              <div className="flex w-full max-w-[140px] flex-col gap-4 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 items-center bg-gray-50 dark:bg-gray-900/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-white">
                <i className="bi bi-hdd-fill text-4xl text-gray-400 dark:text-gray-500"></i>
                <span className="text-center font-medium text-sm">
                  Full Game
                </span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
