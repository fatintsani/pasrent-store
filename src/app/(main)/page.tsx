"use client";

import Image from "next/image";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { motion } from "framer-motion";

import { Hero } from "@/components/ui/animated-hero";

export default function Home() {
  return (
    <>
      <main>
        <Hero />

        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          id="features"
          className="px-4 sm:px-8 py-16 sm:py-24 bg-gray-50 dark:bg-gray-900/40 rounded-3xl sm:rounded-[3rem] mx-4 md:mx-6 my-8 sm:my-10 transition-colors duration-300"
        >
          <div className="flex flex-col gap-10 sm:gap-16 items-center mx-auto w-full max-w-6xl">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tighter text-center text-gray-900 dark:text-white leading-tight">
              Kenapa Memilih
              <br />
              Pasrent Store?
            </h2>
            <div className="flex flex-col md:grid md:grid-cols-2 gap-6 w-full">
              <div className="col-span-1 flex flex-col gap-4 items-start bg-white dark:bg-gray-900 rounded-2xl sm:rounded-3xl p-6 sm:p-10 shadow-sm border border-gray-200 dark:border-gray-800 hover:shadow-md transition-all">
                <div className="bg-[#5000ef]/10 dark:bg-[#00c3cb]/10 p-3 sm:p-4 rounded-2xl text-[#5000ef] dark:text-[#00c3cb] mb-2">
                  <i className="bi bi-controller text-3xl sm:text-4xl"></i>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                  Kondisi Mesin Prima
                </h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                  Unit PS3 dan PS4 yang kami sewakan selalu dirawat dan
                  dipastikan dalam kondisi terbaik agar pengalaman bermain game
                  Anda tidak terganggu, mesin adem dan tidak bising.
                </p>
              </div>
              <div className="col-span-1 flex flex-col gap-4 items-start bg-white dark:bg-gray-900 rounded-2xl sm:rounded-3xl p-6 sm:p-10 shadow-sm border border-gray-200 dark:border-gray-800 hover:shadow-md transition-all">
                <div className="bg-[#5000ef]/10 dark:bg-[#00c3cb]/10 p-3 sm:p-4 rounded-2xl text-[#5000ef] dark:text-[#00c3cb] mb-2">
                  <i className="bi bi-disc text-3xl sm:text-4xl"></i>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                  Game Update Terbaru
                </h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                  Daftar game yang kami sediakan selalu diperbarui secara
                  berkala. Mulai dari game bola terbaru (PES/FIFA), petualangan
                  epik, hingga game keluarga untuk dimainkan bersama.
                </p>
              </div>
              <div className="col-span-1 md:col-span-2 flex flex-col lg:flex-row gap-6 sm:gap-8 items-start lg:items-center bg-gray-900 dark:bg-black text-white rounded-2xl sm:rounded-3xl p-6 sm:p-10 md:p-16 shadow-lg relative overflow-hidden border border-gray-800">
                <div className="absolute -right-10 sm:-right-20 -top-10 sm:-top-20 opacity-5 sm:opacity-10 pointer-events-none">
                  <i className="bi bi-truck text-[12rem] sm:text-[20rem]"></i>
                </div>
                <div className="flex-1 z-10 w-full">
                  <div className="bg-gradient-to-r from-[#5000ef] to-[#00c3cb] text-white inline-block p-2.5 sm:p-3 rounded-2xl mb-4 sm:mb-6 shadow-lg shadow-[#5000ef]/20">
                    <i className="bi bi-truck text-2xl sm:text-3xl"></i>
                  </div>
                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
                    Layanan Antar Jemput
                  </h3>
                  <p className="text-gray-300 dark:text-gray-400 text-sm sm:text-base md:text-lg max-w-xl leading-relaxed">
                    Tidak perlu repot keluar rumah, kami menyediakan layanan
                    antar jemput unit untuk wilayah Desa Garawastu, Kecamatan
                    Sindang, Majalengka dan sekitarnya. Cukup hubungi via
                    WhatsApp, konsol siap dimainkan!
                  </p>
                  <a
                    href="https://wa.me/6283133977214"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-full sm:w-auto items-center justify-center mt-6 sm:mt-8 bg-white px-6 sm:px-8 py-3 sm:py-3.5 text-[#5000ef] font-bold rounded-xl hover:bg-gray-100 transition-colors shadow-sm"
                  >
                    Cek Area Pengiriman
                  </a>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        <motion.section 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="px-4 sm:px-8 py-12 sm:py-16 transition-colors duration-300"
        >
          <div className="flex flex-col gap-10 sm:gap-12 items-center mx-auto w-full max-w-5xl">
            <div className="text-center px-2">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tighter text-gray-900 dark:text-white">
                Kelengkapan{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5000ef] to-[#00c3cb]">
                  Sewa
                </span>
              </h2>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-3 sm:mt-4 max-w-lg mx-auto leading-relaxed">
                Setiap penyewaan sudah termasuk paket lengkap berikut, siap
                pasang dan main.
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:flex lg:flex-wrap justify-center gap-3 sm:gap-4 w-full">
              <div className="flex flex-col gap-3 sm:gap-4 p-4 sm:p-6 rounded-2xl border border-gray-200 dark:border-gray-800 items-center bg-gray-50 dark:bg-gray-900/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-white lg:w-[140px]">
                <i className="bi bi-tv text-3xl sm:text-4xl text-gray-400 dark:text-gray-500"></i>
                <span className="text-center font-medium text-xs sm:text-sm">
                  Kabel HDMI
                </span>
              </div>
              <div className="flex flex-col gap-3 sm:gap-4 p-4 sm:p-6 rounded-2xl border border-gray-200 dark:border-gray-800 items-center bg-gray-50 dark:bg-gray-900/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-white lg:w-[140px]">
                <i className="bi bi-usb-symbol text-3xl sm:text-4xl text-gray-400 dark:text-gray-500"></i>
                <span className="text-center font-medium text-xs sm:text-sm">
                  Kabel Charger
                </span>
              </div>
              
              <div className="col-span-2 md:col-span-1 flex flex-col gap-3 sm:gap-4 p-5 sm:p-6 rounded-2xl border border-transparent items-center bg-gradient-to-br from-[#5000ef] to-[#00c3cb] text-white transform lg:scale-105 shadow-lg shadow-[#5000ef]/30 dark:shadow-[0_0_30px_rgba(0,195,203,0.2)] lg:w-[150px] order-first md:order-none">
                <i className="bi bi-controller text-4xl sm:text-5xl drop-shadow-md"></i>
                <span className="text-center font-bold text-sm sm:text-base leading-tight">
                  2 Stik
                  <br />
                  Original
                </span>
              </div>
              
              <div className="flex flex-col gap-3 sm:gap-4 p-4 sm:p-6 rounded-2xl border border-gray-200 dark:border-gray-800 items-center bg-gray-50 dark:bg-gray-900/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-white lg:w-[140px]">
                <i className="bi bi-plug text-3xl sm:text-4xl text-gray-400 dark:text-gray-500"></i>
                <span className="text-center font-medium text-xs sm:text-sm">
                  Kabel Power
                </span>
              </div>
              <div className="flex flex-col gap-3 sm:gap-4 p-4 sm:p-6 rounded-2xl border border-gray-200 dark:border-gray-800 items-center bg-gray-50 dark:bg-gray-900/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-white lg:w-[140px]">
                <i className="bi bi-hdd-fill text-3xl sm:text-4xl text-gray-400 dark:text-gray-500"></i>
                <span className="text-center font-medium text-xs sm:text-sm">
                  Full Game
                </span>
              </div>
            </div>
          </div>
        </motion.section>
      </main>
    </>
  );
}
