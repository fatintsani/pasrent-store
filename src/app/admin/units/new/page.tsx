"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import Link from "next/link";
import { createUnit } from "@/app/actions/admin/units";
import { getConsoleTypes } from "@/app/actions/admin/console-types";

export default function NewUnitPage() {
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
    const res = await createUnit(formData);

    if (res.success) {
      router.push("/admin/units");
    } else {
      setErrorMsg(res.error || "Gagal menyimpan unit.");
      setLoading(false);
    }
  }

  return (
    <div className="p-4 md:p-8 w-full mx-auto space-y-6">
      <div className="mb-6 flex items-center gap-4">
        <Link
          href="/admin/units"
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tambah Unit Baru</h1>
          <p className="text-muted-foreground mt-1">Masukkan detail spesifikasi fisik unit konsol Anda.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-6 md:p-8 space-y-6">
        {errorMsg && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800/30 rounded-xl text-sm font-medium">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Nama Unit <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              placeholder="Contoh: PS4 Pro Hitam - 01"
              className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#5000ef]/50 transition"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

            <div className="space-y-2">
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Status Ketersediaan <span className="text-red-500">*</span>
              </label>
              <select
                id="status"
                name="status"
                required
                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#5000ef]/50 transition appearance-none"
              >
                <option value="available">Tersedia (Available)</option>
                <option value="maintenance">Dalam Perbaikan (Maintenance)</option>
                <option value="rented">Sedang Disewa (Rented)</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="serial_number" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Serial Number (Opsional)
            </label>
            <input
              id="serial_number"
              name="serial_number"
              type="text"
              placeholder="Contoh: SN-1234567890"
              className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#5000ef]/50 transition"
            />
            <p className="text-xs text-gray-500">Nomor seri unik mesin jika ada, untuk pencatatan inventaris.</p>
          </div>

          <div className="pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-end gap-3">
            <Link
              href="/admin/units"
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
              Simpan Unit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
