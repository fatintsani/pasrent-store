"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  Plus,
  MonitorSpeaker,
  MoreVertical,
  Pencil,
  Trash2,
  AlertCircle,
  Loader2,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  Download,
  BarChart2
} from "lucide-react";
import { deleteUnit } from "@/app/actions/admin/units";

type Unit = any;

export default function UnitsClient({ initialUnits }: { initialUnits: Unit[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>({ key: 'created_at', direction: 'desc' });

  const [processingId, setProcessingId] = useState<string | null>(null);
  const [openActionId, setOpenActionId] = useState<string | null>(null);

  const [showStats, setShowStats] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

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

  const requestSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key: string) => {
    if (!sortConfig || sortConfig.key !== key) return <ArrowUpDown className="w-4 h-4 ml-1 opacity-40 group-hover:opacity-100" />;
    return sortConfig.direction === 'asc' 
      ? <ArrowUp className="w-4 h-4 ml-1 text-[#5000ef] dark:text-[#00c3cb]" /> 
      : <ArrowDown className="w-4 h-4 ml-1 text-[#5000ef] dark:text-[#00c3cb]" />;
  };

  const filteredData = useMemo(() => {
    let filtered = [...initialUnits];

    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(item => 
        item.name?.toLowerCase().includes(lowerQuery) ||
        item.serial_number?.toLowerCase().includes(lowerQuery)
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
  }, [initialUnits, searchQuery, sortConfig]);

  const handleDelete = (id: string) => {
    setConfirmDialog({
      isOpen: true,
      title: "Hapus Unit",
      message: "Apakah Anda yakin ingin menghapus unit konsol ini? Tindakan ini tidak dapat dibatalkan.",
      onConfirm: async () => {
        setConfirmDialog(prev => ({ ...prev, isOpen: false }));
        setProcessingId(id);
        const res = await deleteUnit(id);
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

  const handleExportCSV = () => {
    const headers = ["ID", "NAMA UNIT", "TIPE", "SERIAL NUMBER", "STATUS", "DIBUAT PADA"];
    const csvContent = [
      headers.join(","),
      ...filteredData.map(item => [
        item.id,
        `"${item.name}"`,
        item.console_types?.code || item.type,
        `"${item.serial_number || ""}"`,
        item.status,
        `"${new Date(item.created_at).toLocaleString('id-ID')}"`
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `data_unit_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalUnits = initialUnits.length;
  const availableCount = initialUnits.filter(u => u.status === 'available').length;
  const rentedCount = initialUnits.filter(u => u.status === 'rented').length;
  const maintenanceCount = initialUnits.filter(u => u.status === 'maintenance').length;

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 font-plus-jakarta">
      {/* Header & Main Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Kelola Konsol
          </h1>
          <p className="text-muted-foreground mt-1">
            Manajemen data fisik unit PS3 dan PS4 yang Anda miliki.
          </p>
        </div>
        <Link href="/admin/units/new" className="flex items-center gap-2 bg-gradient-to-r from-[#5000ef] to-[#00c3cb] text-white px-5 py-2.5 rounded-xl font-bold hover:opacity-90 transition">
          <Plus className="w-5 h-5" /> Tambah Unit
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
            Statistik Unit
          </div>
          {showStats ? <ChevronLeft className="w-5 h-5 -rotate-90 transition-transform" /> : <ChevronLeft className="w-5 h-5 rotate-180 transition-transform" />}
        </button>
      </div>

      {/* Summary Cards */}
      <div className={`grid grid-cols-2 lg:grid-cols-4 gap-4 ${showStats ? 'grid' : 'hidden lg:grid'}`}>
        <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-200 dark:border-gray-700 flex flex-col justify-center">
          <span className="text-sm font-medium text-gray-500 flex items-center gap-1.5">
            <MonitorSpeaker className="w-4 h-4" /> Total Unit
          </span>
          <span className="text-3xl font-bold mt-1 text-gray-900 dark:text-white">{totalUnits}</span>
        </div>
        <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-200 dark:border-gray-700 flex flex-col justify-center">
          <span className="text-sm font-medium text-green-600 dark:text-green-400 flex items-center gap-1.5">
            <MonitorSpeaker className="w-4 h-4" /> Tersedia
          </span>
          <span className="text-3xl font-bold mt-1 text-green-600 dark:text-green-400">{availableCount}</span>
        </div>
        <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-200 dark:border-gray-700 flex flex-col justify-center">
          <span className="text-sm font-medium text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
            <MonitorSpeaker className="w-4 h-4" /> Disewa
          </span>
          <span className="text-3xl font-bold mt-1 text-blue-600 dark:text-blue-400">{rentedCount}</span>
        </div>
        <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-200 dark:border-gray-700 flex flex-col justify-center">
          <span className="text-sm font-medium text-red-600 dark:text-red-400 flex items-center gap-1.5">
            <MonitorSpeaker className="w-4 h-4" /> Perawatan
          </span>
          <span className="text-3xl font-bold mt-1 text-red-600 dark:text-red-400">{maintenanceCount}</span>
        </div>
      </div>

      {/* Toolbar: Search & Filter */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-200 dark:border-gray-700 flex flex-col lg:flex-row gap-4 items-center justify-between">
        <div className="w-full lg:w-96 flex gap-2">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Cari nama atau serial number..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-[#5000ef] focus:border-transparent transition"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
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
                <th className="px-6 py-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition select-none group" onClick={() => requestSort('name')}>
                  <div className="flex items-center">UNIT {getSortIcon('name')}</div>
                </th>
                <th className="px-6 py-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition select-none group" onClick={() => requestSort('type')}>
                  <div className="flex items-center">TIPE KONSOL {getSortIcon('type')}</div>
                </th>
                <th className="px-6 py-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition select-none group" onClick={() => requestSort('serial_number')}>
                  <div className="flex items-center">SERIAL NUMBER {getSortIcon('serial_number')}</div>
                </th>
                <th className="px-6 py-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition select-none group" onClick={() => requestSort('status')}>
                  <div className="flex items-center">STATUS {getSortIcon('status')}</div>
                </th>
                <th className="px-6 py-4 text-right">AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800 relative">
              {paginatedData.length > 0 ? (
                paginatedData.map((unit) => (
                  <tr key={unit.id} className="hover:bg-gray-50/80 dark:hover:bg-gray-900/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-[#5000ef]/10 dark:bg-[#00c3cb]/10 text-[#5000ef] dark:text-[#00c3cb] rounded-lg">
                          <MonitorSpeaker className="w-5 h-5" />
                        </div>
                        <span className="font-bold text-gray-900 dark:text-white">{unit.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold">
                      <span className="font-mono font-bold text-[#5000ef] dark:text-[#00c3cb] text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
                        {unit.console_types ? `${unit.console_types.name} (${unit.console_types.code})` : unit.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono text-gray-500">{unit.serial_number || "-"}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full border ${
                        unit.status === 'available' ? 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800/50' :
                        unit.status === 'rented' ? 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800/50' :
                        'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800/50'
                      }`}>
                        {unit.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2 relative">
                        {processingId === unit.id ? (
                          <Loader2 className="w-5 h-5 animate-spin text-[#5000ef]" />
                        ) : (
                          <>
                            <button
                              onClick={() => setOpenActionId(openActionId === unit.id ? null : unit.id)}
                              className="p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </button>
                            
                            {openActionId === unit.id && (
                              <>
                                <div className="fixed inset-0 z-40" onClick={() => setOpenActionId(null)}></div>
                                <div className="absolute right-8 top-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                                  <Link
                                    href={`/admin/units/${unit.id}/edit`}
                                    className="flex items-center gap-2 w-full text-left px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                                  >
                                    <Pencil className="w-4 h-4" /> Edit
                                  </Link>
                                  <div className="h-px bg-gray-100 dark:bg-gray-700 my-1"></div>
                                  <button
                                    onClick={() => {
                                      setOpenActionId(null);
                                      handleDelete(unit.id);
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
                  <td colSpan={5} className="px-6 py-24 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <MonitorSpeaker className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-4" />
                      <p className="text-gray-900 dark:text-white font-bold text-lg">Tidak ada unit</p>
                      <p className="text-gray-500 text-sm mt-1">Coba sesuaikan pencarian Anda atau tambahkan data baru.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {filteredData.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/20 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-500 font-medium">
              Menampilkan {Math.min((currentPage - 1) * itemsPerPage + 1, filteredData.length)} - {Math.min(currentPage * itemsPerPage, filteredData.length)} dari {filteredData.length} data
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

      {/* Custom Global Confirm/Alert Modal */}
      {confirmDialog.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 border border-gray-200 dark:border-gray-800">
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
            <div className="p-6">
              <p className="text-gray-600 dark:text-gray-300">
                {confirmDialog.message}
              </p>
            </div>
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
