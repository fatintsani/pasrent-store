"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import {
  Search,
  SlidersHorizontal,
  ChevronDown,
  CheckCircle2,
  Clock,
  XCircle,
  Filter,
  RotateCcw,
  MoreVertical,
  Eye,
  MapPin,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Ban,
  AlertCircle,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Package,
  Download
} from "lucide-react";
import { updateBookingStatus, updatePaymentStatus, updateMultipleBookingsStatus } from "@/app/actions/admin/bookings";

type Booking = any; // We can type this properly later, but using any for rapid prototyping

export default function BookingsClient({
  initialBookings,
}: {
  initialBookings: Booking[];
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [paymentFilter, setPaymentFilter] = useState("ALL");
  const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' } | null>({ key: 'created_at', direction: 'desc' });

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [showMobileStats, setShowMobileStats] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const [processingId, setProcessingId] = useState<string | null>(null);
  const [selectedBookingIds, setSelectedBookingIds] = useState<string[]>([]);

  // Custom Confirm Modal State
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    isAlert?: boolean;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: "",
    message: "",
    isAlert: false,
    onConfirm: () => {},
  });

  const closeDialog = () => setConfirmDialog(prev => ({ ...prev, isOpen: false }));

  // Dropdown states for actions
  const [openActionId, setOpenActionId] = useState<string | null>(null);

  // Statistics
  const stats = useMemo(() => {
    return {
      total: initialBookings.length,
      pending: initialBookings.filter((b) => b.status === "pending").length,
      processing: initialBookings.filter(
        (b) => b.status === "confirmed" || b.status === "in_progress",
      ).length,
      completed: initialBookings.filter((b) => b.status === "completed").length,
      cancelled: initialBookings.filter((b) => b.status === "cancelled").length,
    };
  }, [initialBookings]);

  // Derived state: Filtered & Sorted
  const filteredBookings = useMemo(() => {
    let result = initialBookings;

    // Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (b) =>
          b.booking_code?.toLowerCase().includes(q) ||
          b.customer_name?.toLowerCase().includes(q),
      );
    }

    // Status Filter
    if (statusFilter !== "ALL") {
      result = result.filter((b) => b.status === statusFilter);
    }

    // Payment Filter
    if (paymentFilter !== "ALL") {
      result = result.filter((b) => b.payment_status === paymentFilter);
    }

    // Sort
    if (sortConfig) {
      result = [...result].sort((a, b) => {
        let aVal = a[sortConfig.key];
        let bVal = b[sortConfig.key];

        // Handle specific fields
        if (sortConfig.key === 'created_at') {
          aVal = new Date(aVal).getTime();
          bVal = new Date(bVal).getTime();
        } else if (sortConfig.key === 'customer') {
          aVal = (a.customer_name || '').toLowerCase();
          bVal = (b.customer_name || '').toLowerCase();
        }

        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [initialBookings, searchQuery, statusFilter, paymentFilter, sortConfig]);

  // Pagination
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage) || 1;
  const paginatedBookings = filteredBookings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const resetFilters = () => {
    setSearchQuery("");
    setStatusFilter("ALL");
    setPaymentFilter("ALL");
    setSortConfig({ key: 'created_at', direction: 'desc' });
    setCurrentPage(1);
  };

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const SortIcon = ({ columnKey }: { columnKey: string }) => {
    if (sortConfig?.key !== columnKey) return <ArrowUpDown className="w-4 h-4 ml-1 opacity-50" />;
    return sortConfig.direction === 'asc' 
      ? <ArrowUp className="w-4 h-4 ml-1 text-[#5000ef] dark:text-[#00c3cb]" />
      : <ArrowDown className="w-4 h-4 ml-1 text-[#5000ef] dark:text-[#00c3cb]" />;
  };

  const handleUpdateStatus = (id: string, newStatus: string) => {
    setConfirmDialog({
      isOpen: true,
      title: "Konfirmasi Perubahan Status",
      message: `Yakin ingin mengubah status pesanan menjadi ${newStatus.toUpperCase()}?`,
      isAlert: false,
      onConfirm: async () => {
        closeDialog();
        setProcessingId(id);
        setOpenActionId(null);
        const res = await updateBookingStatus(id, newStatus);
        if (!res.success) {
          setTimeout(() => {
            setConfirmDialog({
              isOpen: true,
              title: "Gagal Mengubah Status",
              message: res.error || "Terjadi kesalahan yang tidak diketahui.",
              isAlert: true,
              onConfirm: closeDialog
            });
          }, 300);
        }
        setProcessingId(null);
      }
    });
  };

  const handleUpdatePayment = (id: string, newStatus: string) => {
    setConfirmDialog({
      isOpen: true,
      title: "Konfirmasi Pembayaran",
      message: `Tandai pesanan ini sebagai LUNAS?`,
      isAlert: false,
      onConfirm: async () => {
        closeDialog();
        setProcessingId(id);
        const res = await updatePaymentStatus(id, newStatus);
        if (!res.success) {
          setTimeout(() => {
            setConfirmDialog({
              isOpen: true,
              title: "Gagal Mengubah Pembayaran",
              message: res.error || "Terjadi kesalahan yang tidak diketahui.",
              isAlert: true,
              onConfirm: closeDialog
            });
          }, 300);
        }
        setProcessingId(null);
      }
    });
  };

  const handleBulkUpdate = (newStatus: string) => {
    setConfirmDialog({
      isOpen: true,
      title: "Konfirmasi Aksi Massal",
      message: `Yakin ingin mengubah status ${selectedBookingIds.length} pesanan menjadi ${newStatus.toUpperCase()}?`,
      isAlert: false,
      onConfirm: async () => {
        closeDialog();
        const res = await updateMultipleBookingsStatus(selectedBookingIds, newStatus);
        if (!res.success) {
          setTimeout(() => {
            setConfirmDialog({
              isOpen: true,
              title: "Gagal Mengubah Status Massal",
              message: res.error || "Terjadi kesalahan yang tidak diketahui.",
              isAlert: true,
              onConfirm: closeDialog
            });
          }, 300);
        } else {
          setSelectedBookingIds([]);
        }
      }
    });
  };

  const exportToCSV = () => {
    if (filteredBookings.length === 0) return;
    const headers = ["ID Pesanan", "Pelanggan", "Whatsapp", "Total Harga", "Status Pembayaran", "Status", "Tanggal"];
    const rows = filteredBookings.map((b: any) => [
      b.booking_code,
      b.customer_name,
      b.customer_whatsapp,
      b.total_price,
      b.payment_status,
      b.status,
      new Date(b.created_at).toISOString()
    ]);
    
    const csvContent = [
      headers.join(","),
      ...rows.map(e => e.map(f => `"${f}"`).join(","))
    ].join("\n");
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Data_Pesanan_${format(new Date(), 'yyyyMMdd_HHmmss')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800";
      case "in_progress":
        return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border border-purple-200 dark:border-purple-800";
      case "confirmed":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800";
      case "cancelled":
        return "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400 border border-rose-200 dark:border-rose-800";
      default:
        return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-200 dark:border-amber-800";
    }
  };

  const getPaymentBadge = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800";
      case "failed":
        return "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400 border border-rose-200 dark:border-rose-800";
      default:
        return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-200 dark:border-amber-800";
    }
  };

  const renderItemsSummary = (items: any[]) => {
    if (!items || items.length === 0) return "-";
    const firstItem = items[0];
    const consoleName =
      firstItem.units?.name || firstItem.units?.type || "Konsol";
    const packageName =
      firstItem.rental_packages?.name ||
      `${firstItem.rental_packages?.duration_hours} Jam`;

    if (items.length === 1) {
      return `${consoleName} - ${packageName}`;
    } else {
      return `${consoleName} - ${packageName} (+${items.length - 1} item)`;
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 font-plus-jakarta">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Kelola Pesanan
          </h1>
          <p className="text-muted-foreground mt-1">
            Pantau dan kelola seluruh transaksi penyewaan konsol.
          </p>
        </div>
        <Link
          href="/admin/scanner"
          className="flex items-center gap-2 bg-gradient-to-r from-[#5000ef] to-[#00c3cb] text-white px-5 py-2.5 rounded-xl font-bold hover:opacity-90 transition"
        >
          <ScanLineIcon className="w-5 h-5" /> Scan E-Ticket
        </Link>
      </div>

      {/* Mobile Stats Toggle */}
      <button 
        onClick={() => setShowMobileStats(!showMobileStats)}
        className="lg:hidden w-full flex items-center justify-between bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-200 dark:border-gray-700"
      >
        <span className="font-bold text-gray-900 dark:text-white">Statistik Pesanan</span>
        <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${showMobileStats ? 'rotate-180' : ''}`} />
      </button>

      {/* Summary Cards */}
      <div className={`grid-cols-2 lg:grid-cols-5 gap-4 ${showMobileStats ? 'grid' : 'hidden lg:grid'}`}>
        <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-200 dark:border-gray-700 flex flex-col justify-center">
          <span className="text-sm font-medium text-gray-500 flex items-center gap-1.5">
            <Package className="w-4 h-4" /> Total Pesanan
          </span>
          <span className="text-3xl font-bold mt-1 text-gray-900 dark:text-white">
            {stats.total}
          </span>
        </div>
        <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-200 dark:border-gray-700 flex flex-col justify-center">
          <span className="text-sm font-medium text-amber-600 dark:text-amber-500 flex items-center gap-1.5">
            <Clock className="w-4 h-4" /> Menunggu
          </span>
          <span className="text-3xl font-bold mt-1 text-gray-900 dark:text-white">
            {stats.pending}
          </span>
        </div>
        <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-200 dark:border-gray-700 flex flex-col justify-center">
          <span className="text-sm font-medium text-blue-600 dark:text-blue-500 flex items-center gap-1.5">
            <Loader2 className="w-4 h-4" /> Diproses
          </span>
          <span className="text-3xl font-bold mt-1 text-gray-900 dark:text-white">
            {stats.processing}
          </span>
        </div>
        <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-200 dark:border-gray-700 flex flex-col justify-center">
          <span className="text-sm font-medium text-emerald-600 dark:text-emerald-500 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" /> Selesai
          </span>
          <span className="text-3xl font-bold mt-1 text-gray-900 dark:text-white">
            {stats.completed}
          </span>
        </div>
        <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-200 dark:border-gray-700 flex flex-col justify-center">
          <span className="text-sm font-medium text-rose-600 dark:text-rose-500 flex items-center gap-1.5">
            <XCircle className="w-4 h-4" /> Dibatalkan
          </span>
          <span className="text-3xl font-bold mt-1 text-gray-900 dark:text-white">
            {stats.cancelled}
          </span>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-200 dark:border-gray-700 flex flex-col lg:flex-row gap-4 items-center justify-between">
        {/* Search & Mobile Filter Toggle */}
        <div className="w-full lg:w-96 flex gap-2">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Cari nama atau kode booking..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-[#5000ef] focus:border-transparent transition"
            />
          </div>
          <button 
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className={`lg:hidden flex-shrink-0 p-2.5 border border-gray-200 dark:border-gray-700 rounded-xl transition ${showMobileFilters ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white' : 'bg-gray-50 dark:bg-gray-900 text-gray-500'}`}
          >
            <Filter className="w-5 h-5" />
          </button>
        </div>

        {/* Filters & Sort */}
        <div className={`flex-col lg:flex-row flex-wrap items-stretch lg:items-center gap-3 w-full lg:w-auto ${showMobileFilters ? 'flex' : 'hidden lg:flex'}`}>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
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
            onChange={(e) => {
              setPaymentFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-[#5000ef]"
          >
            <option value="ALL">Semua Pembayaran</option>
            <option value="paid">Lunas</option>
            <option value="pending">Belum Bayar</option>
            <option value="failed">Gagal</option>
          </select>


          <button
            onClick={resetFilters}
            className="p-2.5 text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition"
            title="Reset Filters"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
          <button
            onClick={exportToCSV}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#107c41] hover:bg-[#0c5e31] text-white rounded-xl text-sm font-bold transition"
            title="Export ke CSV"
          >
            <Download className="w-4 h-4" /> <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto min-h-[400px] [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 font-semibold select-none">
              <tr>
                <th className="px-6 py-4 w-12">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 rounded border-gray-300 text-[#5000ef] focus:ring-[#5000ef]"
                    checked={selectedBookingIds.length === paginatedBookings.length && paginatedBookings.length > 0}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedBookingIds(paginatedBookings.map((b: any) => b.id));
                      } else {
                        setSelectedBookingIds([]);
                      }
                    }}
                  />
                </th>
                <th className="px-6 py-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition select-none group" onClick={() => handleSort('booking_code')}>
                  <div className="flex items-center">ID Pesanan <SortIcon columnKey="booking_code" /></div>
                </th>
                <th className="px-6 py-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition select-none group" onClick={() => handleSort('customer')}>
                  <div className="flex items-center">Pelanggan <SortIcon columnKey="customer" /></div>
                </th>
                <th className="px-6 py-4">Produk/Item</th>
                <th className="px-6 py-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition select-none group" onClick={() => handleSort('total_price')}>
                  <div className="flex items-center">Total Harga <SortIcon columnKey="total_price" /></div>
                </th>
                <th className="px-6 py-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition select-none group" onClick={() => handleSort('payment_status')}>
                  <div className="flex items-center">Pembayaran <SortIcon columnKey="payment_status" /></div>
                </th>
                <th className="px-6 py-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition select-none group" onClick={() => handleSort('status')}>
                  <div className="flex items-center">Status <SortIcon columnKey="status" /></div>
                </th>
                <th className="px-6 py-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition select-none group" onClick={() => handleSort('created_at')}>
                  <div className="flex items-center">Tanggal <SortIcon columnKey="created_at" /></div>
                </th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800 relative">
              {paginatedBookings.length > 0 ? (
                paginatedBookings.map((booking) => (
                  <tr
                    key={booking.id}
                    className={`hover:bg-gray-50/80 dark:hover:bg-gray-900/30 transition-colors group ${selectedBookingIds.includes(booking.id) ? 'bg-indigo-50/50 dark:bg-indigo-900/20' : ''}`}
                  >
                    <td className="px-6 py-4">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 rounded border-gray-300 text-[#5000ef] focus:ring-[#5000ef]"
                        checked={selectedBookingIds.includes(booking.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedBookingIds([...selectedBookingIds, booking.id]);
                          } else {
                            setSelectedBookingIds(selectedBookingIds.filter(id => id !== booking.id));
                          }
                        }}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-mono font-bold text-[#5000ef] dark:text-[#00c3cb]">
                        {booking.booking_code}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-gray-900 dark:text-white">
                        {booking.customer_name}
                      </p>
                      <p className="text-xs font-medium text-gray-500 mt-0.5">
                        {booking.customer_whatsapp}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-gray-900 dark:text-white">
                        {renderItemsSummary(booking.booking_items)}
                      </p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-bold text-gray-900 dark:text-white">
                        Rp {booking.total_price.toLocaleString("id-ID")}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 text-[11px] font-bold rounded-full uppercase tracking-wider ${getPaymentBadge(booking.payment_status)}`}
                      >
                        {booking.payment_status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 text-[11px] font-bold rounded-full uppercase tracking-wider ${getStatusBadge(booking.status)}`}
                      >
                        {booking.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-600 dark:text-gray-400">
                      {format(new Date(booking.created_at), "dd MMM yyyy", {
                        locale: localeId,
                      })}
                    </td>
                    <td className="px-6 py-4 text-right relative">
                      {processingId === booking.id ? (
                        <Loader2 className="w-5 h-5 animate-spin text-[#5000ef] ml-auto" />
                      ) : (
                        <div className="flex justify-end items-center gap-1 relative">
                          {booking.payment_status === 'pending' && (
                             <button 
                               onClick={() => handleUpdatePayment(booking.id, 'paid')}
                               className="px-2 py-1.5 mr-2 bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:hover:bg-emerald-900/50 rounded-lg text-xs font-bold transition"
                               title="Tandai Lunas"
                             >
                               LUNAS
                             </button>
                          )}
                          <button
                            onClick={() =>
                              setOpenActionId(
                                openActionId === booking.id ? null : booking.id,
                              )
                            }
                            className="p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
                          >
                            <MoreVertical className="w-5 h-5" />
                          </button>

                          {/* Dropdown Menu */}
                          {openActionId === booking.id && (
                            <>
                              <div
                                className="fixed inset-0 z-40"
                                onClick={() => setOpenActionId(null)}
                              ></div>
                              <div className="absolute right-8 top-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                                <Link
                                  href={`/admin/bookings/${booking.id}`}
                                  className="flex items-center gap-2 w-full text-left px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                                >
                                  <Eye className="w-4 h-4" /> Lihat Detail
                                </Link>

                                {booking.status !== "completed" &&
                                  booking.status !== "cancelled" && (
                                    <>
                                      <div className="h-px bg-gray-100 dark:bg-gray-700 my-1"></div>
                                      <button
                                        onClick={() =>
                                          handleUpdateStatus(
                                            booking.id,
                                            "confirmed",
                                          )
                                        }
                                        className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm font-medium text-blue-600 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                                      >
                                        Ubah ke Confirmed
                                      </button>
                                      <button
                                        onClick={() =>
                                          handleUpdateStatus(
                                            booking.id,
                                            "in_progress",
                                          )
                                        }
                                        className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm font-medium text-purple-600 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                                      >
                                        Ubah ke In Progress
                                      </button>
                                      <button
                                        onClick={() =>
                                          handleUpdateStatus(
                                            booking.id,
                                            "completed",
                                          )
                                        }
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
                                      onClick={() =>
                                        handleUpdateStatus(
                                          booking.id,
                                          "cancelled",
                                        )
                                      }
                                      className="flex items-center gap-2 w-full text-left px-4 py-2.5 text-sm font-medium text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors"
                                    >
                                      <Ban className="w-4 h-4" /> Batalkan
                                      Pesanan
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
                      <p className="text-lg font-bold text-gray-900 dark:text-white">
                        Tidak Ada Pesanan
                      </p>
                      <p className="text-gray-500 mt-1 max-w-sm">
                        Data pesanan tidak ditemukan berdasarkan filter atau
                        pencarian Anda.
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
          <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/20 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-500 font-medium">
              Menampilkan{" "}
              {Math.min(
                (currentPage - 1) * itemsPerPage + 1,
                filteredBookings.length,
              )}{" "}
              - {Math.min(currentPage * itemsPerPage, filteredBookings.length)}{" "}
              dari {filteredBookings.length} pesanan
            </div>

            <div className="flex items-center gap-2">
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="px-2 py-1.5 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg text-sm font-medium outline-none focus:ring-2 focus:ring-[#5000ef]"
              >
                <option value={10}>10 Baris</option>
                <option value={25}>25 Baris</option>
                <option value={50}>50 Baris</option>
              </select>

              <div className="flex items-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-1.5 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 transition"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="px-3 py-1.5 text-sm font-bold border-x border-gray-200 dark:border-gray-700">
                  {currentPage} / {totalPages}
                </span>
                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
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

      {/* Bulk Action Bar */}
      {selectedBookingIds.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-xl rounded-2xl px-6 py-4 flex items-center gap-4 z-50 animate-in slide-in-from-bottom-10">
          <span className="text-sm font-bold bg-[#5000ef]/10 text-[#5000ef] px-3 py-1 rounded-full whitespace-nowrap">
            {selectedBookingIds.length} Terpilih
          </span>
          <div className="flex gap-2">
            <select 
              id="bulkStatus" 
              className="px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-[#5000ef]"
            >
              <option value="confirmed">Konfirmasi</option>
              <option value="in_progress">Proses</option>
              <option value="completed">Selesai</option>
              <option value="cancelled">Batal</option>
            </select>
            <button 
              onClick={() => {
                const sel = document.getElementById("bulkStatus") as HTMLSelectElement;
                if(sel) handleBulkUpdate(sel.value);
              }}
              className="bg-[#5000ef] hover:bg-[#4000c0] text-white px-4 py-2 rounded-xl text-sm font-bold transition"
            >
              Terapkan
            </button>
          </div>
        </div>
      )}

      {/* Custom Confirm Dialog (Replacing window.confirm) */}
      {confirmDialog.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800">
              <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <AlertCircle className={`w-5 h-5 ${confirmDialog.isAlert ? 'text-rose-500' : 'text-blue-500'}`} />
                {confirmDialog.title}
              </h3>
              <button onClick={closeDialog} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <p className="text-gray-600 dark:text-gray-300">{confirmDialog.message}</p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-800/50 flex justify-end gap-3 border-t border-gray-100 dark:border-gray-800">
              {!confirmDialog.isAlert && (
                <button 
                  onClick={closeDialog}
                  className="px-4 py-2 font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl transition"
                >
                  Batal
                </button>
              )}
              <button 
                onClick={confirmDialog.isAlert ? closeDialog : confirmDialog.onConfirm}
                className={`px-4 py-2 font-bold text-white rounded-xl transition ${confirmDialog.isAlert ? 'bg-gray-900 hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600' : 'bg-[#5000ef] hover:bg-[#4000c0]'}`}
              >
                {confirmDialog.isAlert ? "Tutup" : "Ya, Lanjutkan"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Needed icon component since lucide-react ScanLine might not be exported directly depending on version, wait it is.
import { ScanLine as ScanLineIcon } from "lucide-react";
