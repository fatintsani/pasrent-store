"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Save, UploadCloud } from "lucide-react";
import Link from "next/link";
import { createGame } from "@/app/actions/admin/games";
import { getConsoleTypes } from "@/app/actions/admin/console-types";
import { compressAndUploadImage } from "@/utils/supabase/client-upload";

export default function NewGamePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [consoleTypes, setConsoleTypes] = useState<any[]>([]);
  const [loadingTypes, setLoadingTypes] = useState(true);

  // Upload Progress State
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<string>("idle");
  const [uploadMessage, setUploadMessage] = useState<string>("");

  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    async function loadTypes() {
      const res = await getConsoleTypes();
      if (res.success) {
        setConsoleTypes(res.data);
      }
      setLoadingTypes(false);
    }
    loadTypes();
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setUploadStatus("idle");

    const formData = new FormData(e.currentTarget);
    const cover_file = formData.get("cover_file") as File | null;
    let final_cover_url = "";

    // Handle Client-Side Upload
    if (cover_file && cover_file.size > 0) {
      setUploadStatus("compressing");
      const uploadRes = await compressAndUploadImage(
        cover_file,
        "games-covers",
        (prog) => {
          setUploadStatus(prog.status);
          setUploadProgress(prog.progress);
          if (prog.message) setUploadMessage(prog.message);
        }
      );

      if (!uploadRes.success) {
        setErrorMsg(uploadRes.error || "Gagal mengunggah gambar");
        setLoading(false);
        setUploadStatus("error");
        return;
      }
      final_cover_url = uploadRes.url || "";
    }

    // Append the public URL to formData so the server action can use it
    formData.set("cover_url", final_cover_url);
    formData.delete("cover_file"); // Server doesn't need the file anymore

    setUploadMessage("Menyimpan ke database...");
    
    const res = await createGame(formData);

    if (res.success) {
      router.push("/admin/games");
    } else {
      setErrorMsg(res.error || "Gagal menyimpan game.");
      setLoading(false);
      setUploadStatus("error");
    }
  }

  return (
    <div className="p-4 md:p-8 w-full mx-auto space-y-6">
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

      <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-6 md:p-8 space-y-6 relative overflow-hidden">
        
        {/* Upload Progress Overlay */}
        {loading && uploadStatus !== "idle" && uploadStatus !== "error" && (
          <div className="absolute inset-0 z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm flex flex-col items-center justify-center animate-in fade-in duration-300">
            <div className="w-full max-w-md bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 text-center">
              <UploadCloud className="w-12 h-12 text-[#5000ef] mx-auto mb-4 animate-bounce" />
              <h3 className="font-bold text-lg mb-1">{uploadMessage}</h3>
              
              <div className="w-full h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden mt-4">
                <div 
                  className="h-full bg-[#5000ef] transition-all duration-300 ease-out"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 font-medium mt-2">{Math.round(uploadProgress)}%</p>
            </div>
          </div>
        )}

        {errorMsg && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800/30 rounded-xl text-sm font-medium">
            {errorMsg}
          </div>
        )}

        <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
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
            <label htmlFor="cover_file" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Cover Game (Otomatis Dikompres)
            </label>
            <input
              id="cover_file"
              name="cover_file"
              type="file"
              accept="image/jpeg, image/png, image/webp"
              className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#5000ef]/50 transition file:cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#5000ef]/10 file:text-[#5000ef] hover:file:bg-[#5000ef]/20 text-sm text-gray-500"
            />
            <p className="text-xs text-gray-500">Gambar ukuran besar akan dikompresi otomatis tanpa membebani kuota pelanggan Anda.</p>
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
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
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Konsol Pendukung <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-4">
                {loadingTypes ? (
                  <Loader2 className="w-4 h-4 animate-spin text-[#5000ef]" />
                ) : (
                  consoleTypes.map(ct => (
                    <label key={ct.id} className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" name="supported_consoles" value={ct.code} className="w-4 h-4 text-[#5000ef] rounded border-gray-300" />
                      <span className="font-medium">{ct.name}</span>
                    </label>
                  ))
                )}
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
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
              {loading ? 'Menyimpan...' : 'Simpan Game'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
