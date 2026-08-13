import { createClient } from "@/utils/supabase/server";
import { Plus, Gamepad2, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import GameActions from "./game-actions";

export default async function AdminGamesPage() {
  const supabase = await createClient();
  
  // Ambil semua data game
  const { data: games } = await supabase
    .from("games")
    .select("*")
    .order("name", { ascending: true });

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Katalog Game</h1>
          <p className="text-muted-foreground mt-1">Manajemen koleksi game untuk direntalkan ke pelanggan.</p>
        </div>
        <Link href="/admin/games/new" className="flex items-center gap-2 bg-[#5000ef] hover:bg-[#4000c0] text-white px-5 py-2.5 rounded-xl font-bold transition shadow-sm">
          <Plus className="w-5 h-5" /> Tambah Game
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-3xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700 text-gray-500 dark:text-gray-400 font-medium">
              <tr>
                <th className="px-6 py-4">GAME</th>
                <th className="px-6 py-4">KONSOL</th>
                <th className="px-6 py-4">FITUR</th>
                <th className="px-6 py-4 text-right">AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
              {games && games.length > 0 ? (
                games.map((game) => (
                  <tr key={game.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-16 bg-gray-100 dark:bg-gray-700 rounded-md overflow-hidden flex items-center justify-center shrink-0 border border-gray-200 dark:border-gray-600">
                          {game.cover_url ? (
                            <img src={game.cover_url} alt={game.name} className="w-full h-full object-cover" />
                          ) : (
                            <ImageIcon className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 dark:text-white text-base">{game.name}</p>
                          <p className="text-xs text-gray-500 truncate max-w-xs">{game.description || "-"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold">
                      <div className="flex flex-wrap gap-1">
                        {game.supported_consoles?.map((c: string) => (
                          <span key={c} className={`px-2.5 py-1 rounded-md text-xs border ${
                            c === 'PS3' ? 'bg-black text-white border-black dark:border-gray-700' : 'bg-[#003791] text-white border-[#003791]'
                          }`}>
                            {c}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {game.is_multiplayer && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border border-purple-200 dark:border-purple-800/50">
                          <Gamepad2 className="w-3 h-3" /> Multiplayer
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <GameActions id={game.id} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                    Belum ada data game.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
