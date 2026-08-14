import { createClient } from "@/utils/supabase/server";
import { Plus, LayoutDashboard, Monitor } from "lucide-react";
import Link from "next/link";
import ConsoleTypeActions from "./console-type-actions";
import Image from "next/image";

export default async function AdminConsoleTypesPage() {
  const supabase = await createClient();
  const { data: consoleTypes } = await supabase.from("console_types").select("*").order("code");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tipe Konsol</h1>
          <p className="text-muted-foreground mt-1">Kelola data profil konsol (seperti PS3, PS4) untuk halaman pelanggan.</p>
        </div>
        <Link href="/admin/console-types/new" className="flex items-center gap-2 bg-[#5000ef] hover:bg-[#4000c0] text-white px-5 py-2.5 rounded-xl font-bold transition shadow-sm">
          <Plus className="w-5 h-5" /> Tambah Tipe
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-3xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700 text-gray-500 dark:text-gray-400 font-medium">
              <tr>
                <th className="px-6 py-4">TIPE KONSOL</th>
                <th className="px-6 py-4">GAMBAR</th>
                <th className="px-6 py-4">FITUR</th>
                <th className="px-6 py-4 text-right">AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
              {consoleTypes && consoleTypes.length > 0 ? (
                consoleTypes.map((type) => (
                  <tr key={type.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-[#5000ef]/10 dark:bg-[#00c3cb]/10 text-[#5000ef] dark:text-[#00c3cb] rounded-lg">
                          <Monitor className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 dark:text-white text-base">{type.name}</p>
                          <p className="text-xs text-gray-500 font-medium mt-0.5">Kode: {type.code}</p>
                          {type.is_featured && <span className="inline-block mt-1 text-[10px] bg-gradient-to-r from-orange-500 to-red-500 text-white px-2 py-0.5 rounded-full font-bold">Featured</span>}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {type.image_url ? (
                        <div className="w-16 h-16 relative rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                          <Image src={type.image_url} alt={type.name} fill className="object-cover" />
                        </div>
                      ) : (
                        <span className="text-gray-400 italic">No Image</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-medium text-gray-700 dark:text-gray-300">
                        {type.features ? type.features.length : 0} item fitur
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <ConsoleTypeActions id={type.id} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                    Belum ada data tipe konsol.
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
