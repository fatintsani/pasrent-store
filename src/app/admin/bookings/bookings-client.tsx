"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { 
  Search, SlidersHorizontal, ChevronDown, CheckCircle2, Clock, 
  XCircle, Filter, RotateCcw, MoreVertical, Eye, MapPin, Loader2,
  ChevronLeft, ChevronRight, Ban
} from "lucide-react";
import { updateBookingStatus } from "@/app/actions/admin/bookings";

type Booking = any; // We can type this properly later, but using any for rapid prototyping

export default function BookingsClient({ initialBookings }: { initialBookings: Booking[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [paymentFilter, setPaymentFilter] = useState("ALL");
  const [sortOption, setSortOption] = useState("newest");
  
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  const [processingId, setProcessingId] = useState<string | null>(null);
  
  // Dropdown states for actions
  const [openActionId, setOpenActionId] = useState<string | null>(null);

  // Statistics
  const stats = useMemo(() => {
    return {
      total: initialBookings.length,
      pending: initialBookings.filter(b => b.status === "pending").length,
      processing: initialBookings.filter(b => b.status === "confirmed" || b.status === "in_progress").length,
      completed: initialBookings.filter(b => b.status === "completed").length,
      cancelled: initialBookings.filter(b => b.status === "cancelled").length,
    };
  }, [initialBookings]);

  // Derived state: Filtered & Sorted
  const filteredBookings = useMemo(() => {
    let result = [...initialBookings];

    // Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(b => 
        b.booking_code?.toLowerCase().includes(q) || 
        b.customer_name?.toLowerCase().includes(q)
      );
    }

    // Status Filter
    if (statusFilter !== "ALL") {
      result = result.filter(b => b.status === statusFilter);
    }

    // Payment Filter
    if (paymentFilter !== "ALL") {
      result = result.filter(b => b.payment_status === paymentFilter);
    }

    // Sort
    result.sort((a, b) => {
      if (sortOption === "newest") return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      if (sortOption === "oldest") return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      if (sortOption === "highest") return b.total_price - a.total_price;
      if (sortOption === "lowest") return a.total_price - b.total_price;
      return 0;
    });

    return result;
  }, [initialBookings, searchQuery, statusFilter, paymentFilter, sortOption]);

  // Pagination
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage) || 1;
  const paginatedBookings = filteredBookings.slice(
    (currentPage - 1) * itemsPerPage, 
    currentPage * itemsPerPage
  );

  const resetFilters = () => {
    setSearchQuery("");
    setStatusFilter("ALL");
    setPaymentFilter("ALL");
    setSortOption("newest");
    setCurrentPage(1);
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    if (!window.confirm(`Yakin ingin mengubah status menjadi ${newStatus.toUpperCase()}?`)) return;
    
    setProcessingId(id);
    setOpenActionId(null);
    const res = await updateBookingStatus(id, newStatus);
    if (!res.success) alert(res.error);
    setProcessingId(null);
    // Page will revalidate and refresh data automatically via Server Action
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800';
      case 'in_progress': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border border-purple-200 dark:border-purple-800';
      case 'confirmed': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800';
      case 'cancelled': return 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400 border border-rose-200 dark:border-rose-800';
      default: return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-200 dark:border-amber-800';
    }
  };

  const getPaymentBadge = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800';
      case 'failed': return 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400 border border-rose-200 dark:border-rose-800';
      default: return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-200 dark:border-amber-800';
    }
  };

  const renderItemsSummary = (items: any[]) => {
    if (!items || items.length === 0) return "-";
    const firstItem = items[0];
    const consoleName = firstItem.units?.name || firstItem.units?.type || "Konsol";
    const packageName = firstItem.rental_packages?.name || `${firstItem.rental_packages?.duration_hours} Jam`;
    
    if (items.length === 1) {
      return `${consoleName} - ${packageName}`;
    } else {
      return `${consoleName} - ${packageName} (+${items.length - 1} item)`;
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Kelola Pesanan</h1>
          <p className="text-muted-foreground mt-1">Pantau dan kelola seluruh transaksi penyewaan konsol.</p>
        </div>
        <Link 
          href="/admin/scanner" 
          className="flex items-center gap-2 bg-gradient-to-r from-[#5000ef] to-[#00c3cb] text-white px-5 py-2.5 rounded-xl font-bold hover:opacity-90 transition shadow-lg shadow-[#5000ef]/20"
        >
          <ScanLineIcon className="w-5 h-5" /> Scan E-Ticket
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col justify-center">
          <span className="text-sm font-medium text-gray-500">Total Pesanan</span>
          <span className="text-3xl font-bold mt-1 text-gray-900 dark:text-white">{stats.total}</span>
        </div>
        <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col justify-center">
          <span className="text-sm font-medium text-amber-600 dark:text-amber-500 flex items-center gap-1.5"><Clock className="w-4 h-4"/> Menunggu</span>
          <span className="text-3xl font-bold mt-1 text-gray-900 dark:text-white">{stats.pending}</span>
        </div>
        <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col justify-center">
          <span className="text-sm font-medium text-blue-600 dark:text-blue-500 flex items-center gap-1.5"><Loader2 className="w-4 h-4"/> Diproses</span>
          <span className="text-3xl font-bold mt-1 text-gray-900 dark:text-white">{stats.processing}</span>
        </div>
        <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col justify-center">
          <span className="text-sm font-medium text-emerald-600 dark:text-emerald-500 flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4"/> Selesai</span>
          <span className="text-3xl font-bold mt-1 text-gray-900 dark:text-white">{stats.completed}</span>
        </div>
        <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col justify-center">
          <span className="text-sm font-medium text-rose-600 dark:text-rose-500 flex items-center gap-1.5"><XCircle className="w-4 h-4"/> Dibatalkan</span>
          <span className="text-3xl font-bold mt-1 text-gray-900 dark:text-white">{stats.cancelled}</span>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col lg:flex-row gap-4 items-center justify-between">
        
        {/* Search */}
        <div className="relative w-full lg:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Cari nama atau kode booking..." 
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-[#5000ef] focus:border-transparent transition"
          />
        </div>

        {/* Filters & Sort */}
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          <select 
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
            className="px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-[#5000ef]"
          >
            <option value="ALL">Semua Status</option>
            <option value="pending">Menunggu</option>
            <option value="confirmed">Dikonfirmasi</option>
            <option value="in_progress">Sedang Sewa</option>
            <option value="completed">Selesai</option>
            <option value="cancelled">Dibatalkan</option>
          </select>
          
          <select 
            value={paymentFilter}
            onChange={(e) => { setPaymentFilter(e.target.value); setCurrentPage(1); }}
            className="px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-[#5000ef]"
          >
            <option value="ALL">Semua Pembayaran</option>
            <option value="paid">Lunas</option>
            <option value="pending">Belum Bayar</option>
            <option value="failed">Gagal</option>
          </select>

          <select 
            value={sortOption}
            onChange={(e) => { setSortOption(e.target.value); setCurrentPage(1); }}
            className="px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-[#5000ef]"
          >
            <option value="newest">Terbaru</option>
            <option value="oldest">Terlama</option>
            <option value="highest">Transaksi Terbesar</option>
            <option value="lowest">Transaksi Terkecil</option>
          </select>

          <button 
            onClick={resetFilters}
            className="p-2.5 text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition"
            title="Reset Filters"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 font-semibold">
              <tr>
                <th className="px-6 py-4">ID Pesanan</th>
                <th className="px-6 py-4">Pelanggan</th>
                <th className="px-6 py-4">Produk/Item</th>
                <th className="px-6 py-4">Total Harga</th>
                <th className="px-6 py-4">Pembayaran</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Tanggal</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800 relative">
              {paginatedBookings.length > 0 ? (
                paginatedBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50/80 dark:hover:bg-gray-900/30 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-mono font-medium text-[#5000ef] dark:text-[#00c3cb]">{booking.booking_code}</span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-gray-900 dark:text-white">{booking.customer_name}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{booking.customer_whatsapp}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-700 dark:text-gray-300">
                        {renderItemsSummary(booking.booking_items)}
                      </p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-bold text-gray-900 dark:text-white">Rp {booking.total_price.toLocaleString('id-ID')}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 text-[11px] font-bold rounded-full uppercase tracking-wider ${getPaymentBadge(booking.payment_status)}`}>
                        {booking.payment_status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 text-[11px] font-bold rounded-full uppercase tracking-wider ${getStatusBadge(booking.status)}`}>
                        {booking.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-400">
                      {format(new Date(booking.created_at), "dd MMM yyyy", { locale: localeId })}
                    </td>
                    <td className="px-6 py-4 text-right relative">
                      {processingId === booking.id ? (
                        <Loader2 className="w-5 h-5 animate-spin text-[#5000ef] ml-auto" />
                      ) : (
                        <div className="relative">
                          <button 
                            onClick={() => setOpenActionId(openActionId === booking.id ? null : booking.id)}
                            className="p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
                          >
                            <MoreVertical className="w-5 h-5" />
                          </button>
                          
                          {/* Dropdown Menu */}
                          {openActionId === booking.id && (
                            <>
                              <div className="fixed inset-0 z-40" onClick={() => setOpenActionId(null)}></div>
                              <div className="absolute right-8 top-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                                <Link 
                                  href={`/admin/bookings/${booking.id}`} 
                                  className="flex items-center gap-2 w-full text-left px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                                >
                                  <Eye className="w-4 h-4" /> Lihat Detail
                                </Link>
                                
                                {booking.status !== "completed" && booking.status !== "cancelled" && (
                                  <>
                                    <div className="h-px bg-gray-100 dark:bg-gray-700 my-1"></div>
                                    <button 
                                      onClick={() => handleUpdateStatus(booking.id, "confirmed")}
                                      className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm font-medium text-blue-600 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                                    >
                                      Ubah ke Confirmed
                                    </button>
                                    <button 
                                      onClick={() => handleUpdateStatus(booking.id, "in_progress")}
                                      className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm font-medium text-purple-600 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                                    >
                                      Ubah ke In Progress
                                    </button>
                                    <button 
                                      onClick={() => handleUpdateStatus(booking.id, "completed")}
                                      className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm font-medium text-emerald-600 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                                    >
                                      Selesaikan Pesanan
                                    </button>
                                  </>
                                )}
                                
                                {booking.status !== "cancelled" && (
                                  <>
                                    <div className="h-px bg-gray-100 dark:bg-gray-700 my-1"></div>
                                    <button 
                                      onClick={() => handleUpdateStatus(booking.id, "cancelled")}
                                      className="flex items-center gap-2 w-full text-left px-4 py-2.5 text-sm font-medium text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors"
                                    >
                                      <Ban className="w-4 h-4" /> Batalkan Pesanan
                                    </button>
                                  </>
                                )}
                              </div>
                            </>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-6 py-24 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                        <Search className="w-8 h-8 text-gray-400" />
                      </div>
                      <p className="text-lg font-bold text-gray-900 dark:text-white">Tidak Ada Pesanan</p>
                      <p className="text-gray-500 mt-1 max-w-sm">
                        Data pesanan tidak ditemukan berdasarkan filter atau pencarian Anda.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Footer */}
        {filteredBookings.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/20 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-500 font-medium">
              Menampilkan {Math.min((currentPage - 1) * itemsPerPage + 1, filteredBookings.length)} - {Math.min(currentPage * itemsPerPage, filteredBookings.length)} dari {filteredBookings.length} pesanan
            </div>
            
            <div className="flex items-center gap-2">
              <select 
                value={itemsPerPage}
                onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                className="px-2 py-1.5 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg text-sm font-medium outline-none focus:ring-2 focus:ring-[#5000ef]"
              >
                <option value={10}>10 Baris</option>
                <option value={25}>25 Baris</option>
                <option value={50}>50 Baris</option>
              </select>
              
              <div className="flex items-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                <button 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-1.5 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 transition"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="px-3 py-1.5 text-sm font-bold border-x border-gray-200 dark:border-gray-700">
                  {currentPage} / {totalPages}
                </span>
                <button 
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-1.5 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 transition"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}

// Needed icon component since lucide-react ScanLine might not be exported directly depending on version, wait it is.
import { ScanLine as ScanLineIcon } from "lucide-react";
