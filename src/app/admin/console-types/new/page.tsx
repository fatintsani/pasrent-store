"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Loader2, Info } from "lucide-react";
import { createConsoleType } from "@/app/actions/admin/console-types";

export default function NewConsoleTypePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const res = await createConsoleType(formData);

    if (res.success) {
      router.push("/admin/console-types");
    } else {
      setError(res.error || "Terjadi kesalahan.");
      setLoading(false);
    }
  }

  return (
    <div className="w-full mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/console-types" className="p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition">
          <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Tambah Tipe Konsol</h1>
          <p className="text-muted-foreground text-sm mt-1">Buat profil tipe konsol baru untuk ditampilkan di halaman pelanggan.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
        {error && (
          <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Kode Konsol (Unik) <span className="text-red-500">*</span></label>
            <input 
              name="code" 
              required 
              placeholder="Contoh: PS5"
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-[#5000ef] focus:border-transparent outline-none transition" 
            />
            <p className="text-xs text-gray-500">Kode ini dipakai untuk relasi ke tabel Paket dan Unit.</p>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Nama Konsol <span className="text-red-500">*</span></label>
            <input 
              name="name" 
              required 
              placeholder="Contoh: PlayStation 5"
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-[#5000ef] focus:border-transparent outline-none transition" 
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700 dark:text-gray-300">URL Gambar (Opsional)</label>
          <input 
            name="image_url" 
            placeholder="Contoh: /imgs/paket-ps5.png atau URL eksternal"
            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-[#5000ef] focus:border-transparent outline-none transition" 
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Daftar Fitur (Pisahkan dengan baris baru)</label>
          <textarea 
            name="features" 
            rows={5}
            placeholder="Contoh:&#10;Resolusi 4K & 120fps&#10;2 Stik DualSense Ori&#10;Free Request Game"
            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-[#5000ef] focus:border-transparent outline-none transition resize-none" 
          ></textarea>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Teks Badge (Opsional)</label>
            <input 
              name="badge" 
              placeholder="Contoh: Paling Laris"
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-[#5000ef] focus:border-transparent outline-none transition" 
            />
          </div>
          
          <div className="flex flex-col justify-center pt-6">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" name="is_featured" value="true" className="w-5 h-5 rounded border-gray-300 text-[#5000ef] focus:ring-[#5000ef]" />
              <div className="flex flex-col">
                <span className="font-bold text-gray-700 dark:text-gray-300">Jadikan "Featured"</span>
                <span className="text-xs text-gray-500">Tampilan card di pelanggan akan menjadi desain full-gradasi.</span>
              </div>
            </label>
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button 
            type="submit" 
            disabled={loading}
            className="flex items-center gap-2 bg-[#5000ef] hover:bg-[#4000c0] text-white px-8 py-3.5 rounded-xl font-bold transition shadow-lg shadow-[#5000ef]/30 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            Simpan Tipe Konsol
          </button>
        </div>
      </form>
    </div>
  );
}
