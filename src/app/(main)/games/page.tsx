import { getGames } from "@/app/actions/catalog";
import GameCatalog from "./game-catalog";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Katalog Game - Pasrent Store",
  description:
    "Daftar lengkap game PS3 dan PS4 yang tersedia untuk dirental di Pasrent Store.",
};

export default async function GamesPage() {
  // Ambil data game dari database
  const { data: games } = await getGames();

  return (
    <main className="min-h-screen pt-20 sm:pt-24 pb-16 sm:pb-20 bg-white dark:bg-[#0d0e11] transition-colors duration-300">
      <section className="px-4 sm:px-8 py-12 sm:py-16 relative transition-colors duration-300">
        {/* Background Ambient untuk Dark Mode */}
        <div className="hidden dark:block absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-900 via-[#0d0e11] to-[#0d0e11] -z-10"></div>

        <div className="h-full mx-auto max-w-7xl relative z-10">
          <div className="text-center pb-10 sm:pb-12 px-2">
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold tracking-tighter text-gray-900 dark:text-white leading-tight">
              Game{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5000ef] to-[#00c3cb]">
                Lengkap
              </span>
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-400 mt-4 sm:mt-6 max-w-2xl mx-auto leading-relaxed">
              Ratusan pilihan game terbaik untuk PS3 dan PS4. Pilih game
              favoritmu, tambahkan ke keranjang, dan nikmati pengalaman bermain
              tanpa batas.
            </p>
          </div>

          {/* Menampilkan Komponen Client untuk Filter & Grid */}
          <GameCatalog initialGames={games || []} />
        </div>
      </section>
    </main>
  );
}
