"use client";

import { useState } from "react";
import { User, Mail, Trash2, UserPlus, Loader2, ShieldAlert } from "lucide-react";
import { createUser, deleteUser } from "@/app/actions/admin/users";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";

export default function UsersClient({ initialUsers, errorMsg, currentUserId }: { initialUsers: any[], errorMsg?: string, currentUserId: string }) {
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [message, setMessage] = useState<{text: string, type: 'success'|'error'} | null>(null);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    isAlert?: boolean;
    onConfirm?: () => void;
  }>({ isOpen: false, title: "", message: "" });

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const formData = new FormData(e.currentTarget);
    const res = await createUser(formData);

    if (res.success) {
      setMessage({ text: "Akun admin berhasil dibuat!", type: 'success' });
      setIsFormOpen(false);
      (e.target as HTMLFormElement).reset();
      // The page will automatically reflect the new user due to revalidatePath
    } else {
      setMessage({ text: res.error || "Gagal membuat akun.", type: 'error' });
    }
    setLoading(false);
  }

  async function handleDelete(id: string) {
    setConfirmDialog({
      isOpen: true,
      title: "Hapus Admin",
      message: "Apakah Anda yakin ingin menghapus akun admin ini? Mereka tidak akan bisa login lagi.",
      isAlert: false,
      onConfirm: async () => {
        setConfirmDialog(prev => ({ ...prev, isOpen: false }));
        setDeleteLoading(id);
        setMessage(null);

        const res = await deleteUser(id);
        
        if (res.success) {
          setMessage({ text: "Akun admin berhasil dihapus.", type: 'success' });
        } else {
          setMessage({ text: res.error || "Gagal menghapus akun.", type: 'error' });
        }
        setDeleteLoading(null);
      }
    });
  }

  return (
    <div className="space-y-6">
      
      {/* Error or Success Message */}
      {errorMsg && (
        <div className="p-4 bg-red-50 text-red-700 rounded-xl border border-red-200 flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold">Akses Ditolak</h4>
            <p className="text-sm mt-1">{errorMsg}</p>
          </div>
        </div>
      )}

      {message && (
        <div className={`p-4 rounded-xl font-bold ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
          {message.text}
        </div>
      )}

      {/* Header Actions */}
      {!errorMsg && (
        <div className="flex justify-end">
          <button 
            onClick={() => setIsFormOpen(!isFormOpen)}
            className="bg-[#5000ef] text-white px-5 py-2.5 rounded-xl font-bold hover:bg-[#4000c0] transition-colors flex items-center gap-2"
          >
            <UserPlus className="w-5 h-5" />
            {isFormOpen ? "Batal Tambah" : "Tambah Admin"}
          </button>
        </div>
      )}

      {/* Create Form */}
      {isFormOpen && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 animate-in slide-in-from-top-4 duration-300">
          <h2 className="text-xl font-bold mb-4">Buat Akun Admin Baru</h2>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Nama Lengkap</label>
                <input 
                  type="text" 
                  name="name" 
                  required
                  placeholder="Contoh: Budi Santoso"
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-[#5000ef]"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Alamat Email</label>
                <input 
                  type="email" 
                  name="email" 
                  required
                  placeholder="budi@pasrent.com"
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-[#5000ef]"
                />
              </div>
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Password Sementara</label>
                <input 
                  type="text" 
                  name="password" 
                  required
                  minLength={6}
                  placeholder="Minimal 6 karakter"
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-[#5000ef]"
                />
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <button 
                type="submit" 
                disabled={loading}
                className="bg-[#5000ef] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#4000c0] transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                Buat Akun
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Users List */}
      {!errorMsg && (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                <th className="p-4 font-bold text-sm text-gray-600 dark:text-gray-400">Admin</th>
                <th className="p-4 font-bold text-sm text-gray-600 dark:text-gray-400">Status</th>
                <th className="p-4 font-bold text-sm text-gray-600 dark:text-gray-400">Bergabung Sejak</th>
                <th className="p-4 font-bold text-sm text-gray-600 dark:text-gray-400 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {initialUsers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-gray-500">
                    Tidak ada data pengguna.
                  </td>
                </tr>
              ) : (
                initialUsers.map((u) => {
                  const isMe = u.id === currentUserId;
                  const name = u.user_metadata?.name || "Admin";
                  
                  return (
                    <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#5000ef]/10 text-[#5000ef] flex items-center justify-center font-bold">
                            <User className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                              {name}
                              {isMe && <span className="bg-[#00c3cb]/10 text-[#00c3cb] text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider">Anda</span>}
                            </div>
                            <div className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
                              <Mail className="w-3 h-3" /> {u.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-green-50 text-green-700 text-xs font-bold border border-green-200">
                          Aktif
                        </span>
                      </td>
                      <td className="p-4 text-sm text-gray-500">
                        {format(new Date(u.created_at), "dd MMM yyyy", { locale: localeId })}
                      </td>
                      <td className="p-4 text-right">
                        {!isMe && (
                          <button
                            onClick={() => handleDelete(u.id)}
                            disabled={deleteLoading === u.id}
                            className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50"
                            title="Hapus akses admin ini"
                          >
                            {deleteLoading === u.id ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
                          </button>
                        )}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Custom Global Confirm/Alert Modal */}
      {confirmDialog.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 border border-gray-200 dark:border-gray-800 shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800">
              <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <ShieldAlert className={`w-5 h-5 ${confirmDialog.isAlert ? 'text-rose-500' : 'text-rose-500'}`} />
                {confirmDialog.title}
              </h3>
              <button 
                onClick={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition text-2xl leading-none"
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
                className={`px-6 py-2 font-bold text-white rounded-xl transition ${
                  confirmDialog.isAlert ? 'bg-gray-900 hover:bg-gray-800' : 'bg-rose-500 hover:bg-rose-600'
                }`}
              >
                {confirmDialog.isAlert ? "Tutup" : "Ya, Hapus"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
