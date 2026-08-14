"use client";

import { Printer } from "lucide-react";

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 text-white px-4 py-2 rounded-xl text-sm font-bold transition print:hidden"
    >
      <Printer className="w-4 h-4" /> Cetak Invoice
    </button>
  );
}
