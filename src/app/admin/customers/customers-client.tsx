"use client";

import { useState } from "react";
import { Search, Mail, Phone, Calendar, User, ShieldAlert, Award } from "lucide-react";
import type { CustomerData } from "@/app/actions/admin/customers";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";

export default function CustomersClient({ initialCustomers, errorMsg }: { initialCustomers: CustomerData[], errorMsg?: string }) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCustomers = initialCustomers.filter(c => {
    const q = searchQuery.toLowerCase();
    return (
      c.customer_name.toLowerCase().includes(q) ||
      c.customer_whatsapp.toLowerCase().includes(q) ||
      (c.customer_email && c.customer_email.toLowerCase().includes(q))
    );
  });

  if (errorMsg) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-xl border border-red-200 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 shrink-0" />
        <p className="font-bold">{errorMsg}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="relative w-full md:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Cari nama, WhatsApp, atau email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5000ef]/50 transition-all text-sm font-medium"
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700">
          <div className="text-gray-500 text-sm font-bold mb-2">Total Pelanggan Unik</div>
          <div className="text-3xl font-black text-gray-900 dark:text-white">{initialCustomers.length}</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700">
          <div className="text-gray-500 text-sm font-bold mb-2">Pelanggan Aktif / Loyal</div>
          <div className="text-3xl font-black text-[#00c3cb]">
            {initialCustomers.filter(c => c.total_bookings > 2).length}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                <th className="p-4 font-bold text-sm text-gray-600 dark:text-gray-400">Pelanggan</th>
                <th className="p-4 font-bold text-sm text-gray-600 dark:text-gray-400">Kontak</th>
                <th className="p-4 font-bold text-sm text-gray-600 dark:text-gray-400">Total Transaksi</th>
                <th className="p-4 font-bold text-sm text-gray-600 dark:text-gray-400">Total Pengeluaran</th>
                <th className="p-4 font-bold text-sm text-gray-600 dark:text-gray-400">Pemesanan Terakhir</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500">
                    Pelanggan tidak ditemukan.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((c, i) => (
                  <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#5000ef]/10 text-[#5000ef] flex items-center justify-center font-bold">
                          {c.customer_name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            {c.customer_name}
                            {c.total_bookings >= 3 && (
                              <span title="Loyal Customer">
                                <Award className="w-4 h-4 text-[#00c3cb]" />
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 space-y-1">
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                        <Phone className="w-4 h-4 text-gray-400" /> {c.customer_whatsapp}
                      </div>
                      {c.customer_email && (
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Mail className="w-4 h-4 text-gray-400" /> {c.customer_email}
                        </div>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-bold">
                        {c.total_bookings} Order
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-[#00c3cb]">
                        Rp {c.total_spent.toLocaleString('id-ID')}
                      </div>
                    </td>
                    <td className="p-4 text-sm text-gray-500">
                      {format(new Date(c.last_booking_date), "dd MMM yyyy", { locale: localeId })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
