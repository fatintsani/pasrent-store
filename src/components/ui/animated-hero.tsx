"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Gamepad2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function Hero() {
  const [titleNumber, setTitleNumber] = useState(0);
  const titles = useMemo(
    () => ["Mudah.", "Terjangkau.", "Praktis.", "Murah.", "Terpercaya."],
    [],
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (titleNumber === titles.length - 1) {
        setTitleNumber(0);
      } else {
        setTitleNumber(titleNumber + 1);
      }
    }, 2000);
    return () => clearTimeout(timeoutId);
  }, [titleNumber, titles]);

  return (
    <div className="w-full">
      <div className="container mx-auto">
        <div className="flex gap-8 py-20 lg:py-32 items-center justify-center flex-col">
          <div>
            <div className="flex gap-4 items-center bg-gray-100 dark:bg-gray-900 py-1.5 sm:py-2 px-3 sm:px-4 rounded-full border border-gray-200 dark:border-gray-800 transition-colors text-center mt-6">
              <span className="text-[10px] sm:text-xs font-semibold tracking-wide text-gray-700 dark:text-gray-300">
                RENTAL PS TERPERCAYA DI MAJALENGKA
              </span>
            </div>
          </div>
          <div className="flex gap-4 flex-col">
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold max-w-2xl tracking-tighter text-center flex flex-col items-center justify-center gap-2 md:gap-4">
              <span className="text-gray-900 dark:text-white leading-tight">
                Sewa PS3 & PS4
              </span>
              <span className="relative flex w-full justify-center overflow-hidden text-center h-[1.4em] px-2">
                {titles.map((title, index) => (
                  <motion.span
                    key={index}
                    className="absolute left-0 right-0 mx-auto font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#5000ef] to-[#00c3cb] w-full text-center block"
                    initial={{ opacity: 0, y: -100 }}
                    transition={{ type: "spring", stiffness: 50 }}
                    animate={
                      titleNumber === index
                        ? {
                            y: 0,
                            opacity: 1,
                          }
                        : {
                            y: titleNumber > index ? -150 : 150,
                            opacity: 0,
                          }
                    }
                  >
                    {title}
                  </motion.span>
                ))}
              </span>
            </h1>

            <p className="font-normal text-base sm:text-lg md:text-xl leading-relaxed tracking-tight text-gray-600 dark:text-gray-400 max-w-2xl text-center px-2">
              Mainkan game-game favoritmu di rumah tanpa harus beli konsol.
              <br className="hidden sm:block" />
              Layanan antar jemput tersedia untuk area Majalengka dan
              sekitarnya!
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 sm:mt-8 w-full sm:w-auto px-4 sm:px-0">
            <Button
              asChild
              size="lg"
              className="w-full sm:w-auto cursor-pointer bg-gradient-to-r from-[#5000ef] to-[#00c3cb] text-white px-8 py-3.5 rounded-xl font-bold hover:opacity-90 transition-all shadow-lg shadow-[#5000ef]/20 dark:shadow-[0_0_20px_rgba(80,0,239,0.3)] text-center flex items-center justify-center h-auto border-0"
            >
              <Link href="/konsol">
                Lihat Daftar Harga <Gamepad2 className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="w-full sm:w-auto cursor-pointer border-gray-300 dark:border-gray-600 bg-transparent text-gray-900 dark:text-white px-8 py-3.5 rounded-xl font-bold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-center flex items-center justify-center gap-2 h-auto"
            >
              <Link href="/booking">
                <i className="bi bi-whatsapp text-[#00c3cb] text-lg"></i> Pesan
                Sekarang
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export { Hero };
