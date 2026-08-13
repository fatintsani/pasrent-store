"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import Link from "next/link";
import { createGame } from "@/app/actions/admin/games";

export default function NewGamePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    const formData = new FormData(e.currentTarget);
    const res = await createGame(formData);

    if (res.success) {
      router.push("/admin/games");
    } else {
      setErrorMsg(res.error || "Gagal menyimpan game.");
      setLoading(false);
    }
  }

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="mb-6 flex items-center gap-4">
        <Link
          href="/admin/games"
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tambah Game Baru</h1>
          <p className="text-muted-foreground mt-1">Masukkan detail game ke dalam katalog katalog rental.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-3xl shadow-sm p-8">
        {errorMsg && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800/30 rounded-xl text-sm font-medium">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-bold text-gray-700 dark:text-gray-300">
              Judul Game <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              placeholder="Contoh: FIFA 24, GTA V"
              className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#5000ef]/50 transition"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="cover_url" className="text-sm font-bold text-gray-700 dark:text-gray-300">
              URL Cover Game (Opsional)
            </label>
            <input
              id="cover_url"
              name="cover_url"
              type="url"
              placeholder="Contoh: https://example.com/image.jpg"
              className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#5000ef]/50 transition"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-bold text-gray-700 dark:text-gray-300">
              Deskripsi Singkat (Opsional)
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              placeholder="Game bola terpopuler dengan fitur..."
              className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#5000ef]/50 transition resize-none"
            ></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300">
                Konsol Pendukung <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" name="supported_consoles" value="PS3" className="w-4 h-4 text-[#5000ef] rounded border-gray-300" />
                  <span className="font-medium">PlayStation 3 (PS3)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" name="supported_consoles" value="PS4" className="w-4 h-4 text-[#5000ef] rounded border-gray-300" />
                  <span className="font-medium">PlayStation 4 (PS4)</span>
                </label>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300">
                Fitur Game
              </label>
              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" name="is_multiplayer" value="true" className="w-4 h-4 text-[#5000ef] rounded border-gray-300" />
                  <span className="font-medium">Mendukung Multiplayer (2+ Pemain)</span>
                </label>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-end gap-3">
            <Link
              href="/admin/games"
              className="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-bold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition"
            >
              Batal
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-[#5000ef] text-white font-bold rounded-xl hover:bg-[#4000c0] transition disabled:opacity-70 flex items-center gap-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              Simpan Game
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
