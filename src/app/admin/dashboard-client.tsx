"use client";

import Link from "next/link";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";
import { 
  Wallet, 
  Gamepad2, 
  Users, 
  Clock, 
  Plus, 
  ArrowRight,
  MonitorPlay
} from "lucide-react";

export default function DashboardClient({ 
  stats, 
  recentBookings, 
  chartData 
}: { 
  stats: any, 
  recentBookings: any[], 
  chartData: any[] 
}) {
  return (
    <div className="p-4 md:p-8 w-full max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 font-plus-jakarta">
      {/* Header & Quick Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white mb-2">Overview Dashboard</h1>
          <p className="text-muted-foreground">Monitor performa dan aktivitas rental PS Anda.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <Link href="/admin/bookings/new" className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-gradient-to-r from-[#5000ef] to-[#00c3cb] text-white px-5 py-2.5 rounded-xl font-bold hover:opacity-90 transition">
            <Plus className="w-5 h-5" /> Pesanan Baru
          </Link>
          <Link href="/admin/units/new" className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white px-5 py-2.5 rounded-xl font-bold hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 transition">
            <MonitorPlay className="w-5 h-5" /> Tambah Unit
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-200 dark:border-gray-700 flex flex-col justify-center relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-green-50 dark:bg-green-900/20 rounded-full group-hover:scale-110 transition-transform duration-500"></div>
          <span className="text-sm font-medium text-gray-500 flex items-center gap-1.5 relative z-10">
            <Wallet className="w-4 h-4 text-green-500" /> Total Pendapatan
          </span>
          <span className="text-3xl font-bold mt-2 text-gray-900 dark:text-white relative z-10">
            Rp {stats.totalRevenue.toLocaleString('id-ID')}
          </span>
        </div>

        {/* Active Rentals */}
        <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-200 dark:border-gray-700 flex flex-col justify-center relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-blue-50 dark:bg-blue-900/20 rounded-full group-hover:scale-110 transition-transform duration-500"></div>
          <span className="text-sm font-medium text-gray-500 flex items-center gap-1.5 relative z-10">
            <Clock className="w-4 h-4 text-blue-500" /> Pesanan Aktif
          </span>
          <span className="text-3xl font-bold mt-2 text-gray-900 dark:text-white relative z-10">
            {stats.activeRentals} <span className="text-sm font-medium text-gray-400">pesanan</span>
          </span>
        </div>

        {/* Available Units */}
        <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-200 dark:border-gray-700 flex flex-col justify-center relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-purple-50 dark:bg-purple-900/20 rounded-full group-hover:scale-110 transition-transform duration-500"></div>
          <span className="text-sm font-medium text-gray-500 flex items-center gap-1.5 relative z-10">
            <Gamepad2 className="w-4 h-4 text-[#5000ef]" /> Unit Tersedia
          </span>
          <span className="text-3xl font-bold mt-2 text-gray-900 dark:text-white relative z-10">
            {stats.availableUnits} <span className="text-sm font-medium text-gray-400">/ {stats.totalUnits} unit</span>
          </span>
        </div>

        {/* Total Customers */}
        <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-200 dark:border-gray-700 flex flex-col justify-center relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-orange-50 dark:bg-orange-900/20 rounded-full group-hover:scale-110 transition-transform duration-500"></div>
          <span className="text-sm font-medium text-gray-500 flex items-center gap-1.5 relative z-10">
            <Users className="w-4 h-4 text-orange-500" /> Pelanggan Unik
          </span>
          <span className="text-3xl font-bold mt-2 text-gray-900 dark:text-white relative z-10">
            {stats.totalCustomers} <span className="text-sm font-medium text-gray-400">orang</span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Section */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Pendapatan 7 Hari Terakhir</h2>
          </div>
          <div className="w-full h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" className="dark:stroke-gray-700" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#6b7280' }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#6b7280' }}
                  tickFormatter={(value) => `Rp ${(value / 1000)}k`}
                />
                <Tooltip 
                  cursor={{ fill: '#f3f4f6', className: 'dark:fill-gray-800' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: any) => [`Rp ${Number(value).toLocaleString('id-ID')}`, 'Pendapatan']}
                />
                <Bar 
                  dataKey="revenue" 
                  fill="#5000ef" 
                  radius={[4, 4, 0, 0]}
                  barSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Pesanan Terbaru</h2>
            <Link href="/admin/bookings" className="text-sm font-bold text-[#5000ef] hover:text-[#4000c0] transition flex items-center gap-1">
              Lihat Semua <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="flex-1 overflow-y-auto pr-2 space-y-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {recentBookings.length > 0 ? (
              recentBookings.map((booking) => (
                <Link 
                  key={booking.id} 
                  href={`/admin/bookings/${booking.id}`}
                  className="block p-4 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-[#5000ef]/30 bg-gray-50/50 dark:bg-gray-900/50 hover:bg-gray-50 dark:hover:bg-gray-800 transition group"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-mono text-xs font-bold text-[#5000ef] dark:text-[#00c3cb]">
                      {booking.booking_code}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                      booking.status === 'completed' ? 'bg-green-100 text-green-700' :
                      booking.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                      booking.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                      'bg-orange-100 text-orange-700'
                    }`}>
                      {booking.status.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="font-bold text-gray-900 dark:text-white mb-1 truncate">{booking.customer_name}</p>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500 font-medium">{new Date(booking.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</span>
                    <span className="font-bold text-gray-900 dark:text-white">Rp {booking.total_price.toLocaleString('id-ID')}</span>
                  </div>
                </Link>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center py-8">
                <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-3">
                  <Clock className="w-6 h-6 text-gray-400" />
                </div>
                <p className="text-gray-900 dark:text-white font-bold text-sm">Belum ada pesanan</p>
                <p className="text-gray-500 text-xs mt-1">Pesanan terbaru akan muncul di sini.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
