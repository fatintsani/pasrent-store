import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import { getPackages } from "@/app/actions/catalog";
import { getConsoleTypes } from "@/app/actions/admin/console-types";

export const metadata: Metadata = {
  title: "Konsol & Harga Sewa - Pasrent Store",
  description: "Pilihan harga sewa PS3 dan PS4 serta kelengkapan sewa yang Anda dapatkan di Pasrent Store.",
};

export default async function KonsolPage() {
  const { data: packages } = await getPackages();
  const { data: consoleTypes } = await getConsoleTypes();

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
          <div className="items-stretch justify-center gap-8 mx-auto flex flex-col md:flex-row flex-wrap max-w-5xl">
            {consoleTypes && consoleTypes.length > 0 ? (
              consoleTypes.map((type: any) => {
                const typePackages = packages.filter(p => p.console_type === type.code).sort((a, b) => a.duration_hours - b.duration_hours);
                
                // Determine styling based on is_featured
                const cardClass = type.is_featured 
                  ? "flex flex-col justify-between w-full md:w-[48%] p-10 bg-gradient-to-br from-[#5000ef] to-[#00c3cb] text-white rounded-[2.5rem] transform transition duration-500 hover:scale-105 shadow-xl shadow-[#5000ef]/40 dark:shadow-[0_0_40px_rgba(0,195,203,0.2)] relative border border-transparent"
                  : "flex flex-col justify-between w-full md:w-[48%] p-10 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-[2.5rem] transform transition duration-500 hover:scale-105 hover:border-[#5000ef] dark:hover:border-[#00c3cb] text-gray-900 dark:text-white shadow-lg dark:shadow-none relative";

                return (
                  <div key={type.id} className={cardClass}>
                    {type.badge && (
                      <div className={`absolute -top-4 right-10 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wide z-10 shadow-md ${type.is_featured ? 'bg-white text-[#5000ef]' : 'bg-[#5000ef] text-white'}`}>
                        {type.badge}
                      </div>
                    )}
                    
                    <div className="flex flex-col">
                      {type.image_url ? (
                        <Image
                          src={type.image_url}
                          alt={`Sewa ${type.name}`}
                          width={400}
                          height={400}
                          className={`w-full aspect-square object-cover rounded-3xl mb-8 shadow-md ${type.is_featured ? 'border border-white/10' : 'dark:shadow-lg border border-gray-100 dark:border-gray-800'}`}
                        />
                      ) : (
                        <div className={`w-full aspect-square rounded-3xl mb-8 shadow-md flex items-center justify-center ${type.is_featured ? 'bg-white/10 border border-white/10' : 'bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700'}`}>
                          <span className={type.is_featured ? "text-white/50" : "text-gray-400"}>No Image</span>
                        </div>
                      )}
                      
                      <div>
                        <h3 className={`font-bold text-2xl ${type.is_featured ? '' : 'text-gray-900 dark:text-gray-100'}`}>{type.name}</h3>
                      </div>
                      
                      <div className="mt-6 flex flex-col gap-3">
                        {typePackages.length > 0 ? (
                          <div className="flex flex-col">
                            <span className={`font-medium mb-1 ${type.is_featured ? 'text-white/80' : 'text-gray-500'}`}>Mulai dari</span>
                            <span className={`text-4xl font-bold ${type.is_featured ? 'text-white' : 'text-gray-900 dark:text-gray-100'}`}>
                              Rp {Math.min(...typePackages.map(p => p.price)).toLocaleString('id-ID')} - {Math.max(...typePackages.map(p => p.price)).toLocaleString('id-ID')}
                            </span>
                          </div>
                        ) : (
                          <p className={`italic ${type.is_featured ? 'text-white/70' : 'text-gray-500'}`}>Harga belum diatur</p>
                        )}
                      </div>

                      <ul className={`flex flex-col gap-4 mt-10 font-medium ${type.is_featured ? 'text-white' : 'text-gray-600 dark:text-gray-400'}`}>
                        {(type.features || []).map((feature: string, i: number) => (
                          <li key={i} className="flex items-start gap-3">
                            <i className={`bi bi-check-circle-fill mt-1 text-lg ${type.is_featured ? 'text-white' : 'text-[#5000ef] dark:text-[#00c3cb]'}`}></i>
                            <p>{feature}</p>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="mt-12">
                      <a
                        href="/booking"
                        className={`flex items-center justify-center w-full h-14 px-4 py-2 text-base font-bold transition-all rounded-2xl ${
                          type.is_featured 
                            ? 'text-[#5000ef] bg-white hover:bg-gray-100 shadow-xl shadow-black/10' 
                            : 'text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-200 dark:border-transparent'
                        }`}
                      >
                        Pesan {type.code}
                      </a>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="w-full text-center py-20 text-gray-500">
                Belum ada tipe konsol. Tambahkan di panel Admin.
              </div>
            )}
          </div>
        </div>
      </section>

    </main>
  );
}
