"use client";

import { Edit2, Trash2, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { deletePackage } from "@/app/actions/admin/packages";

export default function PackageActions({ id }: { id: string }) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm("Yakin ingin menghapus paket ini?")) return;
    
    setLoading(true);
    const res = await deletePackage(id);
    if (!res.success) {
      alert(res.error);
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-end gap-2">
      <Link href={`/admin/packages/${id}/edit`} className="p-2 text-gray-400 hover:text-[#5000ef] dark:hover:text-[#00c3cb] transition">
        <Edit2 className="w-4 h-4" />
      </Link>
      <button 
        onClick={handleDelete}
        disabled={loading}
        className="p-2 text-gray-400 hover:text-red-500 transition disabled:opacity-50"
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
      </button>
    </div>
  );
}
