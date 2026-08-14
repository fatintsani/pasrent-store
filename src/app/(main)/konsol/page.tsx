import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import { getPackages } from "@/app/actions/catalog";

export const metadata: Metadata = {
  title: "Konsol & Harga Sewa - Pasrent Store",
  description: "Pilihan harga sewa PS3 dan PS4 serta kelengkapan sewa yang Anda dapatkan di Pasrent Store.",
};

export default async function KonsolPage() {
  const { data: packages } = await getPackages();

  const ps3Packages = packages.filter(p => p.console_type === 'PS3').sort((a, b) => a.duration_hours - b.duration_hours);
  const ps4Packages = packages.filter(p => p.console_type === 'PS4').sort((a, b) => a.duration_hours - b.duration_hours);

  return (
    <main className="min-h-screen pt-24 pb-20 bg-white dark:bg-[#0d0e11] transition-colors duration-300">
      <section className="px-8 py-24 relative transition-colors duration-300">
        <div className="hidden dark:block absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-900 via-[#0d0e11] to-[#0d0e11] -z-10"></div>
        <div className="h-full mx-auto max-w-6xl relative z-10">
          <div className="mx-auto max-w-7xl px-4 text-center pb-16">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter text-gray-900 dark:text-white text-center">
              Pilihan Harga <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5000ef] to-[#00c3cb]">Sewa Konsol</span>
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-4 max-w-xl mx-auto">
              Harga bersahabat, kualitas hebat. Pilih konsol yang sesuai dengan keinginanmu.
            </p>
          </div>
          <div className="items-center justify-center gap-8 mx-auto flex flex-col md:flex-row max-w-4xl">
            {/* PS3 Pricing */}
            <div className="flex flex-col justify-between w-full md:w-1/2 h-full p-10 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-[2.5rem] transform transition duration-500 hover:scale-105 hover:border-[#5000ef] dark:hover:border-[#00c3cb] text-gray-900 dark:text-white shadow-lg dark:shadow-none">
              <div className="flex flex-col">
                <Image
                  src="/imgs/paket-ps3.png"
                  alt="Sewa PS3"
                  width={400}
                  height={400}
                  className="w-full aspect-square object-cover rounded-3xl mb-8 shadow-md dark:shadow-lg border border-gray-100 dark:border-gray-800"
                />
                <div>
                  <h3 className="font-bold text-2xl text-gray-900 dark:text-gray-100">PlayStation 3</h3>
                </div>
                
                <div className="mt-6 flex flex-col gap-3">
                  {ps3Packages.map((pkg, idx) => (
                    <div key={pkg.id} className="flex items-end gap-2">
                      <span className={`${idx === 0 ? 'text-4xl' : 'text-2xl'} font-bold ${idx !== 0 && 'text-gray-700 dark:text-gray-300'}`}>
                        Rp {pkg.price.toLocaleString('id-ID')}
                      </span>
                      <span className="text-gray-500 font-medium mb-1">/ {pkg.duration_hours} Jam</span>
                    </div>
                  ))}
                  {ps3Packages.length === 0 && (
                    <p className="text-gray-500 italic">Harga belum diatur</p>
                  )}
                </div>

                <ul className="flex flex-col gap-4 mt-10 text-gray-600 dark:text-gray-400">
                  <li className="flex items-start gap-3">
                    <i className="bi bi-check-circle-fill text-[#5000ef] dark:text-[#00c3cb] mt-1 text-lg"></i>
                    <p>Konsol PS3 Fat / Slim</p>
                  </li>
                  <li className="flex items-start gap-3">
                    <i className="bi bi-check-circle-fill text-[#5000ef] dark:text-[#00c3cb] mt-1 text-lg"></i>
                    <p>2 Stik Wireless</p>
                  </li>
                  <li className="flex items-start gap-3">
                    <i className="bi bi-check-circle-fill text-[#5000ef] dark:text-[#00c3cb] mt-1 text-lg"></i>
                    <p>Kabel HDMI & Power lengkap</p>
                  </li>
                  <li className="flex items-start gap-3">
                    <i className="bi bi-check-circle-fill text-[#5000ef] dark:text-[#00c3cb] mt-1 text-lg"></i>
                    <p>Bebas request game (PES update, GTA V, dll)</p>
                  </li>
                </ul>
              </div>
              <div className="mt-12">
                <a
                  href="/booking"
                  className="flex items-center justify-center w-full h-14 px-4 py-2 text-base font-bold text-gray-900 dark:text-white transition-all bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-2xl border border-gray-200 dark:border-transparent"
                >
                  Pesan PS3
                </a>
              </div>
            </div>

            {/* PS4 Pricing */}
            <div className="flex flex-col justify-between w-full md:w-1/2 h-full p-10 bg-gradient-to-br from-[#5000ef] to-[#00c3cb] text-white rounded-[2.5rem] transform transition duration-500 hover:scale-105 shadow-xl shadow-[#5000ef]/40 dark:shadow-[0_0_40px_rgba(0,195,203,0.2)] relative border border-transparent">
              <div className="absolute -top-4 right-10 bg-white text-[#5000ef] text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wide z-10 shadow-md">
                Paling Laris
              </div>
              <div className="flex flex-col">
                <Image
                  src="/imgs/paket-ps4.png"
                  alt="Sewa PS4"
                  width={400}
                  height={400}
                  className="w-full aspect-square object-cover rounded-3xl mb-8 shadow-md border border-white/10"
                />
                <div>
                  <h3 className="font-bold text-2xl">PlayStation 4</h3>
                </div>
                
                <div className="mt-6 flex flex-col gap-3">
                  {ps4Packages.map((pkg, idx) => (
                    <div key={pkg.id} className="flex items-end gap-2">
                      <span className={`${idx === 0 ? 'text-4xl text-white' : 'text-2xl text-white/90'} font-bold`}>
                        Rp {pkg.price.toLocaleString('id-ID')}
                      </span>
                      <span className="text-white/80 font-medium mb-1">/ {pkg.duration_hours} Jam</span>
                    </div>
                  ))}
                  {ps4Packages.length === 0 && (
                    <p className="text-white/70 italic">Harga belum diatur</p>
                  )}
                </div>

                <ul className="flex flex-col gap-4 mt-10 text-white font-medium">
                  <li className="flex items-start gap-3">
                    <i className="bi bi-check-circle-fill text-white mt-1 text-lg"></i>
                    <p>Konsol PS4 Slim / Pro</p>
                  </li>
                  <li className="flex items-start gap-3">
                    <i className="bi bi-check-circle-fill text-white mt-1 text-lg"></i>
                    <p>2 Stik DualShock 4 Original</p>
                  </li>
                  <li className="flex items-start gap-3">
                    <i className="bi bi-check-circle-fill text-white mt-1 text-lg"></i>
                    <p>Grafis maksimal & mulus</p>
                  </li>
                  <li className="flex items-start gap-3">
                    <i className="bi bi-check-circle-fill text-white mt-1 text-lg"></i>
                    <p>Game unggulan (FC 24, God of War, dll)</p>
                  </li>
                </ul>
              </div>
              <div className="mt-12">
                <a
                  href="/booking"
                  className="flex items-center justify-center w-full h-14 px-4 py-2 text-base font-bold text-[#5000ef] transition-all bg-white hover:bg-gray-100 rounded-2xl shadow-xl shadow-black/10"
                >
                  Pesan PS4
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
