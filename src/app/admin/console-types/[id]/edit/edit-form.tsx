"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Loader2, Image as ImageIcon, Upload } from "lucide-react";
import Image from "next/image";
import { updateConsoleType } from "@/app/actions/admin/console-types";

export default function EditConsoleTypeForm({ consoleType }: { consoleType: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(consoleType.image_url || null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImagePreview(url);
    } else {
      setImagePreview(consoleType.image_url || null);
    }
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const res = await updateConsoleType(consoleType.id, formData);

    if (res.success) {
      router.push("/admin/console-types");
    } else {
      setError(res.error || "Terjadi kesalahan.");
      setLoading(false);
    }
  }

  // Join features back to newline separated string for textarea
  const featuresText = consoleType.features ? consoleType.features.join('\n') : "";

  return (
    <div className="p-4 md:p-8 w-full mx-auto space-y-6">
      <div className="mb-6 flex items-center gap-4">
        <Link href="/admin/console-types" className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            Edit Tipe Konsol: {consoleType.name}
          </h1>
          <p className="text-muted-foreground mt-1">Perbarui profil tipe konsol.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-6 md:p-8 space-y-6">
        {error && (
          <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Kode Konsol (Unik) <span className="text-red-500">*</span></label>
            <input 
              name="code" 
              required 
              defaultValue={consoleType.code}
              placeholder="Contoh: PS5"
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-[#5000ef] focus:border-transparent outline-none transition" 
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Nama Konsol <span className="text-red-500">*</span></label>
            <input 
              name="name" 
              required 
              defaultValue={consoleType.name}
              placeholder="Contoh: PlayStation 5"
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-[#5000ef] focus:border-transparent outline-none transition" 
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Gambar Konsol</label>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 p-6 bg-gray-50 dark:bg-gray-900 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl">
            <div className="relative w-32 h-32 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center overflow-hidden shrink-0">
              {imagePreview ? (
                <Image src={imagePreview} alt="Preview" fill className="object-cover" />
              ) : (
                <ImageIcon className="w-8 h-8 text-gray-300 dark:text-gray-600" />
              )}
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-3">
                <label className="relative flex items-center justify-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl cursor-pointer text-sm font-bold transition">
                  <Upload className="w-4 h-4" />
                  <span>Ubah Gambar</span>
                  <input 
                    type="file" 
                    name="image" 
                    accept="image/*"
                    onChange={handleImageChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </label>
              </div>
              <p className="text-xs text-gray-500">Format: JPG, PNG. Ukuran ideal: 800x800px (Rasio 1:1). Biarkan kosong jika tidak ingin mengubah gambar lama.</p>
            </div>
          </div>
          <input type="hidden" name="image_url" value={consoleType.image_url || ""} />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Daftar Fitur (Pisahkan dengan baris baru)</label>
          <textarea 
            name="features" 
            rows={5}
            defaultValue={featuresText}
            placeholder="Contoh:&#10;Resolusi 4K & 120fps&#10;2 Stik DualSense Ori&#10;Free Request Game"
            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-[#5000ef] focus:border-transparent outline-none transition resize-none" 
          ></textarea>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Teks Badge (Opsional)</label>
            <input 
              name="badge" 
              defaultValue={consoleType.badge || ""}
              placeholder="Contoh: Paling Laris"
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-[#5000ef] focus:border-transparent outline-none transition" 
            />
          </div>
          
          <div className="flex flex-col justify-center pt-6">
            <label className="flex items-center gap-3 cursor-pointer">
              <input 
                type="checkbox" 
                name="is_featured" 
                value="true" 
                defaultChecked={consoleType.is_featured}
                className="w-5 h-5 rounded border-gray-300 text-[#5000ef] focus:ring-[#5000ef]" 
              />
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
            className="flex items-center gap-2 bg-[#5000ef] hover:bg-[#4000c0] text-white px-8 py-3.5 rounded-xl font-bold transition disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            Simpan Perubahan
          </button>
        </div>
      </form>
    </div>
  );
}
