import { createClient } from "@/utils/supabase/server";
import { Plus, Edit2, Trash2, MonitorSpeaker } from "lucide-react";
import Link from "next/link";

export default async function AdminUnitsPage() {
  const supabase = await createClient();
  
  // Ambil semua data unit
  const { data: units } = await supabase
    .from("units")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Kelola Konsol</h1>
          <p className="text-muted-foreground mt-1">Manajemen data fisik unit PS3 dan PS4 yang Anda miliki.</p>
        </div>
        <button className="flex items-center gap-2 bg-[#5000ef] hover:bg-[#4000c0] text-white px-5 py-2.5 rounded-xl font-bold transition shadow-sm">
          <Plus className="w-5 h-5" /> Tambah Unit
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-3xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700 text-gray-500 dark:text-gray-400 font-medium">
              <tr>
                <th className="px-6 py-4">UNIT</th>
                <th className="px-6 py-4">TIPE KONSOL</th>
                <th className="px-6 py-4">SERIAL NUMBER</th>
                <th className="px-6 py-4">STATUS</th>
                <th className="px-6 py-4 text-right">AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
              {units && units.length > 0 ? (
                units.map((unit) => (
                  <tr key={unit.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-[#5000ef]/10 dark:bg-[#00c3cb]/10 text-[#5000ef] dark:text-[#00c3cb] rounded-lg">
                          <MonitorSpeaker className="w-5 h-5" />
                        </div>
                        <span className="font-bold text-gray-900 dark:text-white">{unit.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold">
                      <span className={`px-2.5 py-1 rounded-md text-xs border ${
                        unit.type === 'PS3' ? 'bg-black text-white border-black dark:border-gray-700' : 'bg-[#003791] text-white border-[#003791]'
                      }`}>
                        {unit.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono text-gray-500">{unit.serial_number || "-"}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                        unit.status === 'available' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                        unit.status === 'rented' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                        'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                      }`}>
                        {unit.status.toUpperCase()}
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
                    Belum ada data unit konsol.
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
