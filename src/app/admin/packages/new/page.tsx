"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import Link from "next/link";
import { createPackage } from "@/app/actions/admin/packages";
import { getConsoleTypes } from "@/app/actions/admin/console-types";

export default function NewPackagePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [consoleTypes, setConsoleTypes] = useState<any[]>([]);
  const [loadingTypes, setLoadingTypes] = useState(true);

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

    const formData = new FormData(e.currentTarget);
    const res = await createPackage(formData);

    if (res.success) {
      router.push("/admin/packages");
    } else {
      setErrorMsg(res.error || "Gagal menyimpan paket.");
      setLoading(false);
    }
  }

  return (
    <div className="p-4 md:p-8 w-full mx-auto space-y-6">
      <div className="mb-6 flex items-center gap-4">
        <Link
          href="/admin/packages"
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tambah Paket Baru</h1>
          <p className="text-muted-foreground mt-1">Buat variasi harga penyewaan berdasarkan durasi.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-6 md:p-8 space-y-6">
        {errorMsg && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800/30 rounded-xl text-sm font-medium">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Nama Paket <span className="text-red-500">*</span>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                placeholder="Contoh: Paket Harian, 12 Jam"
                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#5000ef]/50 transition"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="console_type_id" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Tipe Konsol <span className="text-red-500">*</span>
              </label>
              <select
                id="console_type_id"
                name="console_type_id"
                required
                disabled={loadingTypes}
                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#5000ef]/50 transition appearance-none"
              >
                <option value="">Pilih Tipe Konsol</option>
                {consoleTypes.map(ct => (
                  <option key={ct.id} value={ct.id}>{ct.name} ({ct.code})</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="duration_hours" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Durasi Sewa (Jam) <span className="text-red-500">*</span>
              </label>
              <input
                id="duration_hours"
                name="duration_hours"
                type="number"
                min="1"
                required
                placeholder="Contoh: 12"
                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#5000ef]/50 transition"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Harga (Rp) <span className="text-red-500">*</span>
              </label>
              <input
                id="price"
                name="price"
                type="number"
                min="0"
                step="1000"
                required
                placeholder="Contoh: 100000"
                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#5000ef]/50 transition"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Deskripsi Singkat (Opsional)
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              placeholder="Berlaku untuk hari biasa..."
              className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#5000ef]/50 transition resize-none"
            ></textarea>
          </div>

          <div className="pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-end gap-3">
            <Link
              href="/admin/packages"
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
              Simpan Paket
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
