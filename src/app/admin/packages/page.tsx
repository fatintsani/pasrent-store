import { createClient } from "@/utils/supabase/server";
import { Plus, Edit2, Trash2, Clock, Tag } from "lucide-react";

export default async function AdminPackagesPage() {
  const supabase = await createClient();
  
  // Ambil semua data paket
  const { data: packages } = await supabase
    .from("rental_packages")
    .select("*")
    .order("duration_hours", { ascending: true });

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Paket Harga</h1>
          <p className="text-muted-foreground mt-1">Atur variasi durasi dan harga sewa untuk PS3 dan PS4.</p>
        </div>
        <button className="flex items-center gap-2 bg-[#5000ef] hover:bg-[#4000c0] text-white px-5 py-2.5 rounded-xl font-bold transition shadow-sm">
          <Plus className="w-5 h-5" /> Tambah Paket
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-3xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700 text-gray-500 dark:text-gray-400 font-medium">
              <tr>
                <th className="px-6 py-4">NAMA PAKET</th>
                <th className="px-6 py-4">KONSOL</th>
                <th className="px-6 py-4">DURASI</th>
                <th className="px-6 py-4">HARGA</th>
                <th className="px-6 py-4 text-right">AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
              {packages && packages.length > 0 ? (
                packages.map((pkg) => (
                  <tr key={pkg.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-[#5000ef]/10 dark:bg-[#00c3cb]/10 text-[#5000ef] dark:text-[#00c3cb] rounded-lg">
                          <Tag className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 dark:text-white">{pkg.name}</p>
                          <p className="text-xs text-gray-500">{pkg.description || "-"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold">
                      <span className={`px-2.5 py-1 rounded-md text-xs border ${
                        pkg.console_type === 'PS3' ? 'bg-black text-white border-black dark:border-gray-700' : 'bg-[#003791] text-white border-[#003791]'
                      }`}>
                        {pkg.console_type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="flex items-center gap-1 font-medium">
                        <Clock className="w-4 h-4 text-gray-400" /> {pkg.duration_hours} Jam
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-lg text-gray-900 dark:text-white">
                        Rp {pkg.price.toLocaleString('id-ID')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 text-gray-400 hover:text-[#5000ef] dark:hover:text-[#00c3cb] transition">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-red-500 transition">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    Belum ada data paket harga.
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
