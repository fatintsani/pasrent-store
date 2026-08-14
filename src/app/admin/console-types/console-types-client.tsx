"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  Plus,
  Monitor,
  MoreVertical,
  Pencil,
  Trash2,
  Download,
  AlertCircle,
  Loader2,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Eye,
  ChevronLeft,
  ChevronRight,
  Star,
  Tag,
  ImageOff,
  BarChart2
} from "lucide-react";
import Image from "next/image";
import { deleteConsoleType, deleteMultipleConsoleTypes } from "@/app/actions/admin/console-types";

type ConsoleType = {
  id: string;
  code: string;
  name: string;
  image_url: string | null;
  badge: string | null;
  is_featured: boolean;
  features: string[];
};

export default function ConsoleTypesClient({ initialConsoleTypes }: { initialConsoleTypes: ConsoleType[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState<{ key: keyof ConsoleType; direction: 'asc' | 'desc' } | null>({ key: 'code', direction: 'asc' });

  const [processingId, setProcessingId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [openActionId, setOpenActionId] = useState<string | null>(null);

  // States for standard UI features
  const [showStats, setShowStats] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

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
    onConfirm: () => {},
  });

  // Sorting
  const requestSort = (key: keyof ConsoleType) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key: keyof ConsoleType) => {
    if (!sortConfig || sortConfig.key !== key) return <ArrowUpDown className="w-4 h-4 ml-1 opacity-40 group-hover:opacity-100" />;
    return sortConfig.direction === 'asc' 
      ? <ArrowUp className="w-4 h-4 ml-1 text-[#5000ef] dark:text-[#00c3cb]" /> 
      : <ArrowDown className="w-4 h-4 ml-1 text-[#5000ef] dark:text-[#00c3cb]" />;
  };

  // Filter & Sort Data
  const filteredData = useMemo(() => {
    let filtered = [...initialConsoleTypes];

    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(lowerQuery) || 
        item.code.toLowerCase().includes(lowerQuery)
      );
    }

    if (sortConfig) {
      filtered.sort((a, b) => {
        const valA = a[sortConfig.key];
        const valB = b[sortConfig.key];

        if (valA === null) return sortConfig.direction === 'asc' ? 1 : -1;
        if (valB === null) return sortConfig.direction === 'asc' ? -1 : 1;

        if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
        if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [initialConsoleTypes, searchQuery, sortConfig]);

  // Bulk Selection
  const toggleSelectAll = () => {
    if (selectedIds.length === filteredData.length && filteredData.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredData.map(item => item.id));
    }
  };

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(selectedId => selectedId !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  // Actions
  const handleDelete = (id: string) => {
    setConfirmDialog({
      isOpen: true,
      title: "Hapus Tipe Konsol",
      message: "Apakah Anda yakin ingin menghapus tipe konsol ini? Tindakan ini tidak dapat dibatalkan.",
      onConfirm: async () => {
        setConfirmDialog(prev => ({ ...prev, isOpen: false }));
        setProcessingId(id);
        const res = await deleteConsoleType(id);
        setProcessingId(null);
        if (!res.success) {
          setConfirmDialog({
            isOpen: true,
            title: "Gagal Menghapus",
            message: res.error || "Terjadi kesalahan.",
            isAlert: true,
            onConfirm: () => setConfirmDialog(prev => ({ ...prev, isOpen: false }))
          });
        }
      }
    });
  };

  const handleBulkDelete = () => {
    setConfirmDialog({
      isOpen: true,
      title: "Hapus Massal",
      message: `Anda yakin ingin menghapus ${selectedIds.length} tipe konsol yang dipilih? Tindakan ini tidak dapat dibatalkan.`,
      onConfirm: async () => {
        setConfirmDialog(prev => ({ ...prev, isOpen: false }));
        setProcessingId("bulk");
        const res = await deleteMultipleConsoleTypes(selectedIds);
        setProcessingId(null);
        if (res.success) {
          setSelectedIds([]);
        } else {
          setConfirmDialog({
            isOpen: true,
            title: "Gagal Menghapus",
            message: res.error || "Terjadi kesalahan.",
            isAlert: true,
            onConfirm: () => setConfirmDialog(prev => ({ ...prev, isOpen: false }))
          });
        }
      }
    });
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = ["ID", "KODE", "NAMA KONSOL", "FEATURED", "JUMLAH FITUR"];
    const csvContent = [
      headers.join(","),
      ...filteredData.map(item => [
        item.id,
        item.code,
        `"${item.name}"`,
        item.is_featured ? "Ya" : "Tidak",
        item.features?.length || 0
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `tipe_konsol_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Stats calculation
  const totalTypes = initialConsoleTypes.length;
  const featuredCount = initialConsoleTypes.filter(t => t.is_featured).length;
  const withBadgeCount = initialConsoleTypes.filter(t => t.badge).length;
  const noImageCount = initialConsoleTypes.filter(t => !t.image_url).length;

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 font-plus-jakarta">
      {/* Header & Main Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Tipe Konsol
          </h1>
          <p className="text-muted-foreground mt-1">
            Kelola data profil konsol (seperti PS3, PS4) untuk halaman pelanggan.
          </p>
        </div>
        <Link href="/admin/console-types/new" className="flex items-center gap-2 bg-gradient-to-r from-[#5000ef] to-[#00c3cb] text-white px-5 py-2.5 rounded-xl font-bold hover:opacity-90 transition">
          <Plus className="w-5 h-5" /> Tambah Tipe
        </Link>
      </div>

      {/* Mobile Stats Toggle */}
      <div className="lg:hidden">
        <button 
          onClick={() => setShowStats(!showStats)}
          className="w-full flex items-center justify-between p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl font-bold text-gray-700 dark:text-gray-300"
        >
          <div className="flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-[#5000ef]" />
            Statistik Tipe Konsol
          </div>
          {showStats ? <ChevronLeft className="w-5 h-5 -rotate-90 transition-transform" /> : <ChevronLeft className="w-5 h-5 rotate-180 transition-transform" />}
        </button>
      </div>

      {/* Summary Cards */}
      <div className={`grid grid-cols-2 lg:grid-cols-4 gap-4 ${showStats ? 'grid' : 'hidden lg:grid'}`}>
        <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-200 dark:border-gray-700 flex flex-col justify-center">
          <span className="text-sm font-bold text-gray-500 flex items-center gap-1.5">
            <Monitor className="w-4 h-4" /> Total Tipe
          </span>
          <span className="text-3xl font-black mt-1 text-gray-900 dark:text-white">{totalTypes}</span>
        </div>
        <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-200 dark:border-gray-700 flex flex-col justify-center">
          <span className="text-sm font-bold text-orange-500 flex items-center gap-1.5">
            <Star className="w-4 h-4" /> Featured
          </span>
          <span className="text-3xl font-black mt-1 text-gray-900 dark:text-white">{featuredCount}</span>
        </div>
        <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-200 dark:border-gray-700 flex flex-col justify-center">
          <span className="text-sm font-bold text-blue-500 flex items-center gap-1.5">
            <Tag className="w-4 h-4" /> Ber-Badge
          </span>
          <span className="text-3xl font-black mt-1 text-gray-900 dark:text-white">{withBadgeCount}</span>
        </div>
        <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-200 dark:border-gray-700 flex flex-col justify-center">
          <span className="text-sm font-bold text-red-500 flex items-center gap-1.5">
            <ImageOff className="w-4 h-4" /> Tanpa Gambar
          </span>
          <span className="text-3xl font-black mt-1 text-gray-900 dark:text-white">{noImageCount}</span>
        </div>
      </div>

      {/* Toolbar: Search & Filter */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-200 dark:border-gray-700 flex flex-col lg:flex-row gap-4 items-center justify-between">
        <div className="w-full lg:w-96 flex gap-2">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Cari nama atau kode..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-[#5000ef] focus:border-transparent transition"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="flex items-center gap-3 w-full lg:w-auto">
          <button
            onClick={handleExportCSV}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#107c41] hover:bg-[#0c5e31] text-white rounded-xl text-sm font-bold transition w-full lg:w-auto"
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
                    checked={selectedIds.length > 0 && selectedIds.length === filteredData.length}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded border-gray-300 text-[#5000ef] focus:ring-[#5000ef] cursor-pointer"
                  />
                </th>
                <th className="px-6 py-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition select-none group" onClick={() => requestSort('name')}>
                  <div className="flex items-center">
                    TIPE KONSOL {getSortIcon('name')}
                  </div>
                </th>
                <th className="px-6 py-4">GAMBAR</th>
                <th className="px-6 py-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition select-none group" onClick={() => requestSort('features')}>
                  <div className="flex items-center">
                    FITUR {getSortIcon('features')}
                  </div>
                </th>
                <th className="px-6 py-4 text-right">AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800 relative">
              {paginatedData.length > 0 ? (
                paginatedData.map((type) => (
                  <tr key={type.id} className={`hover:bg-gray-50/80 dark:hover:bg-gray-900/30 transition-colors group ${selectedIds.includes(type.id) ? 'bg-indigo-50/50 dark:bg-indigo-900/20' : ''}`}>
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(type.id)}
                        onChange={() => toggleSelect(type.id)}
                        className="w-4 h-4 rounded border-gray-300 text-[#5000ef] focus:ring-[#5000ef] cursor-pointer"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-[#5000ef]/10 dark:bg-[#00c3cb]/10 text-[#5000ef] dark:text-[#00c3cb] rounded-lg">
                          <Monitor className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 dark:text-white text-base">{type.name}</p>
                          <p className="text-xs font-medium text-gray-500 mt-0.5">
                            Kode: <span className="font-mono font-bold text-[#5000ef] dark:text-[#00c3cb]">{type.code}</span>
                          </p>
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
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2 relative">
                        {processingId === type.id ? (
                          <Loader2 className="w-5 h-5 animate-spin text-[#5000ef]" />
                        ) : (
                          <>
                            <button
                              onClick={() => setOpenActionId(openActionId === type.id ? null : type.id)}
                              className="p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </button>
                            
                            {/* Dropdown Menu */}
                            {openActionId === type.id && (
                              <>
                                <div
                                  className="fixed inset-0 z-40"
                                  onClick={() => setOpenActionId(null)}
                                ></div>
                                <div className="absolute right-8 top-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                                  <Link
                                    href={`/admin/console-types/${type.id}/edit`}
                                    className="flex items-center gap-2 w-full text-left px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                                  >
                                    <Pencil className="w-4 h-4" /> Edit
                                  </Link>
                                  <button
                                    onClick={() => {
                                      setOpenActionId(null);
                                      handleDelete(type.id);
                                    }}
                                    className="flex items-center gap-2 w-full text-left px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                  >
                                    <Trash2 className="w-4 h-4" /> Hapus
                                  </button>
                                </div>
                              </>
                            )}
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <Monitor className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-4" />
                      <p className="text-gray-500 font-medium text-lg">Tipe Konsol tidak ditemukan</p>
                      <p className="text-gray-400 text-sm mt-1">Coba sesuaikan pencarian Anda atau tambahkan data baru.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {filteredData.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/20 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-500 font-bold">
              Menampilkan{" "}
              {Math.min((currentPage - 1) * itemsPerPage + 1, filteredData.length)} -{" "}
              {Math.min(currentPage * itemsPerPage, filteredData.length)} dari{" "}
              {filteredData.length} data
            </div>

            <div className="flex items-center gap-2">
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="px-2 py-1.5 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg text-sm font-bold outline-none focus:ring-2 focus:ring-[#5000ef]"
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
                  {currentPage} / {totalPages || 1}
                </span>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className="p-1.5 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 transition"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Floating Action Bar untuk Bulk Selection */}
      {selectedIds.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl px-6 py-4 flex items-center gap-4 z-50 animate-in slide-in-from-bottom-10">
          <span className="font-bold text-[#5000ef] dark:text-[#00c3cb] bg-[#5000ef]/10 dark:bg-[#00c3cb]/10 px-3 py-1 rounded-full text-sm">
            {selectedIds.length} terpilih
          </span>
          <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-2"></div>
          
          <button
            onClick={handleBulkDelete}
            disabled={processingId === "bulk"}
            className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400 font-bold rounded-xl hover:bg-red-100 dark:hover:bg-red-900/50 transition disabled:opacity-50"
          >
            {processingId === "bulk" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
            Hapus Massal
          </button>
          
          <button
            onClick={() => setSelectedIds([])}
            className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition ml-2"
          >
            Batal
          </button>
        </div>
      )}

      {/* Custom Global Confirm/Alert Modal */}
      {confirmDialog.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 border border-gray-200 dark:border-gray-800">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800">
              <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <AlertCircle className={`w-5 h-5 ${confirmDialog.isAlert ? 'text-rose-500' : 'text-blue-500'}`} />
                {confirmDialog.title}
              </h3>
              <button 
                onClick={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"
              >
                &times;
              </button>
            </div>
            {/* Body */}
            <div className="p-6">
              <p className="text-gray-600 dark:text-gray-300">
                {confirmDialog.message}
              </p>
            </div>
            {/* Footer */}
            <div className="p-4 bg-gray-50 dark:bg-gray-800/50 flex justify-end gap-3 border-t border-gray-100 dark:border-gray-800">
              {!confirmDialog.isAlert && (
                <button
                  onClick={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
                  className="px-4 py-2 font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl transition"
                >
                  Batal
                </button>
              )}
              <button
                onClick={confirmDialog.onConfirm}
                className={`px-4 py-2 font-bold text-white rounded-xl transition ${
                  confirmDialog.isAlert ? 'bg-gray-900 hover:bg-gray-800' : 'bg-[#5000ef] hover:bg-[#4000c0]'
                }`}
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
