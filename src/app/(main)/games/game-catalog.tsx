"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, Users, Gamepad2, Play } from "lucide-react";

interface Game {
  id: string;
  name: string;
  image_url?: string | null;
  description?: string | null;
  is_multiplayer?: boolean;
  supported_consoles: string[];
}

export default function GameCatalog({ initialGames }: { initialGames: Game[] }) {
  const [activeFilter, setActiveFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const filters = [
    { id: "ALL", label: "Semua Game" },
    { id: "PS4", label: "PlayStation 4" },
    { id: "PS3", label: "PlayStation 3" },
    { id: "MULTIPLAYER", label: "Multiplayer" }
  ];

  // Filtering Logic
  const filteredGames = initialGames.filter((game) => {
    // 1. Search Query
    if (searchQuery && !game.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    // 2. Tab Filter
    if (activeFilter === "ALL") return true;
    if (activeFilter === "MULTIPLAYER") return game.is_multiplayer;
    if (activeFilter === "PS4") return (game.supported_consoles || []).includes("PS4");
    if (activeFilter === "PS3") return (game.supported_consoles || []).includes("PS3");

    return true;
  });

  return (
    <div className="w-full">
      {/* Controls (Search & Filters) */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 md:gap-6 mb-8 md:mb-12">
        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2 sm:gap-3 w-full md:w-auto justify-center md:justify-start bg-gray-50 dark:bg-gray-900 p-2 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-inner">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all duration-300 ${
                activeFilter === f.id
                  ? "bg-gradient-to-r from-[#5000ef] to-[#00c3cb] text-white shadow-lg shadow-[#5000ef]/30"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-800"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-96">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Cari judul game..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 sm:py-3.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#5000ef]/50 focus:border-transparent transition-all shadow-sm text-gray-900 dark:text-white placeholder-gray-400 text-sm sm:text-base"
          />
        </div>
      </div>

      {/* Grid Catalog */}
      {filteredGames.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
          {filteredGames.map((game) => (
            <div 
              key={game.id} 
              className="group relative flex flex-col bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl sm:rounded-3xl overflow-hidden transform transition duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-[#5000ef]/20 dark:hover:shadow-[0_0_40px_rgba(0,195,203,0.15)]"
            >
              {/* Badges Absolute */}
              <div className="absolute top-3 sm:top-4 left-3 sm:left-4 z-20 flex flex-col gap-2">
                {(game.supported_consoles || []).map(console => (
                  <span key={console} className={`px-2.5 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold shadow-md ${
                    console === 'PS4' 
                      ? 'bg-[#003791] text-white border border-[#003791]' 
                      : 'bg-black text-white border border-gray-700'
                  }`}>
                    {console}
                  </span>
                ))}
              </div>
              
              {game.is_multiplayer && (
                <div className="absolute top-3 sm:top-4 right-3 sm:right-4 z-20">
                  <span className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full text-[10px] sm:text-xs font-bold shadow-md">
                    <Users className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> 2-4 P
                  </span>
                </div>
              )}

              {/* Cover Image */}
              <div className="relative w-full aspect-[3/4] bg-gray-100 dark:bg-gray-800 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/20 to-transparent z-10"></div>
                {game.image_url ? (
                  <Image 
                    src={game.image_url} 
                    alt={game.name} 
                    fill 
                    className="object-cover object-center group-hover:scale-110 transition duration-700 ease-in-out"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                    <Gamepad2 className="w-12 h-12 sm:w-16 sm:h-16 mb-2 opacity-50" />
                    <span className="text-xs sm:text-sm font-medium">No Cover</span>
                  </div>
                )}
                
                {/* Floating Title on bottom of image */}
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 z-20 transform translate-y-2 group-hover:translate-y-0 transition duration-500">
                  <h3 className="text-xl sm:text-2xl font-bold text-white leading-tight drop-shadow-md">
                    {game.name}
                  </h3>
                </div>
              </div>

              {/* Card Body */}
              <div className="flex flex-col flex-grow p-4 sm:p-6">
                <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm line-clamp-2 mb-4 sm:mb-6 flex-grow">
                  {game.description || "Rasakan pengalaman bermain game terbaik dengan grafik memukau dan gameplay yang seru."}
                </p>
                
                <Link
                  href="/booking"
                  className="flex items-center justify-center gap-2 w-full py-3 sm:py-3.5 rounded-xl text-sm sm:text-base font-bold transition-all duration-300 bg-gray-50 hover:bg-gray-100 text-gray-900 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white border border-gray-200 dark:border-gray-700 group-hover:bg-gradient-to-r group-hover:from-[#5000ef] group-hover:to-[#00c3cb] group-hover:text-white group-hover:border-transparent group-hover:shadow-lg"
                >
                  <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" /> Pesan Sekarang
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 sm:py-20 px-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl sm:rounded-3xl border border-dashed border-gray-300 dark:border-gray-700">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4 sm:mb-6">
            <Search className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2 text-center">Game tidak ditemukan</h3>
          <p className="text-gray-500 text-center text-sm sm:text-base max-w-md">
            Maaf, kami tidak menemukan game yang sesuai dengan filter atau kata kunci pencarian Anda.
          </p>
          <button 
            onClick={() => { setSearchQuery(""); setActiveFilter("ALL"); }}
            className="mt-6 px-6 py-2.5 bg-[#5000ef] hover:bg-[#4000c0] text-white text-sm sm:text-base font-bold rounded-xl transition"
          >
            Reset Filter
          </button>
        </div>
      )}
    </div>
  );
}
