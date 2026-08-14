"use client";

import { useState } from "react";
import { Save, Loader2, Server, Wrench, Mail, ShieldAlert } from "lucide-react";
import { updateMultipleSettings } from "@/app/actions/admin/settings";

export default function SettingsClient({ initialSettings }: { initialSettings: any }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

  const [activeTab, setActiveTab] = useState<'general' | 'email'>('general');

  // Form states
  const [appMode, setAppMode] = useState(initialSettings.app_mode || 'development');
  const [maintenanceMode, setMaintenanceMode] = useState(initialSettings.maintenance_mode || false);
  const [smtpConfig, setSmtpConfig] = useState(initialSettings.smtp_config || {
    host: "",
    port: "465",
    user: "",
    pass: "",
    from: ""
  });

  async function handleSave() {
    setLoading(true);
    setMessage(null);

    const payload = {
      app_mode: appMode,
      maintenance_mode: maintenanceMode,
      smtp_config: smtpConfig
    };

    const res = await updateMultipleSettings(payload);

    if (res.success) {
      setMessage({ text: "Pengaturan berhasil disimpan!", type: 'success' });
    } else {
      setMessage({ text: res.error || "Gagal menyimpan pengaturan.", type: 'error' });
    }
    setLoading(false);
  }

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Sidebar Tabs */}
      <div className="w-full md:w-64 shrink-0 flex flex-col gap-2">
        <button 
          onClick={() => setActiveTab('general')}
          className={`flex items-center gap-3 p-3 rounded-xl border font-bold transition-all ${
            activeTab === 'general' 
              ? 'bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-[#5000ef] dark:text-[#00c3cb]' 
              : 'border-transparent text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800/50'
          }`}
        >
          <Server className="w-5 h-5" /> General & Mode
        </button>
        <button 
          onClick={() => setActiveTab('email')}
          className={`flex items-center gap-3 p-3 rounded-xl border font-bold transition-all ${
            activeTab === 'email' 
              ? 'bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-[#5000ef] dark:text-[#00c3cb]' 
              : 'border-transparent text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800/50'
          }`}
        >
          <Mail className="w-5 h-5" /> Konfigurasi Email
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-6">
        
        {message && (
          <div className={`p-4 mb-6 rounded-xl font-bold flex items-center gap-2 ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
            {message.type === 'error' && <ShieldAlert className="w-5 h-5" />}
            {message.text}
          </div>
        )}

        {/* Tab 1: General */}
        {activeTab === 'general' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Environment Mode</h2>
              <p className="text-sm text-gray-500 mb-4">Pilih lingkungan aplikasi saat ini. Mode development menggunakan Mailpit lokal untuk tes email.</p>
              
              <div className="flex gap-4">
                <label className={`flex-1 p-4 rounded-xl border cursor-pointer transition-all ${appMode === 'development' ? 'border-[#5000ef] bg-[#5000ef]/5' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'}`}>
                  <div className="flex items-center gap-3 mb-2">
                    <input 
                      type="radio" 
                      name="app_mode" 
                      value="development" 
                      checked={appMode === 'development'} 
                      onChange={(e) => setAppMode(e.target.value)}
                      className="w-5 h-5 text-[#5000ef]"
                    />
                    <span className="font-bold text-gray-900 dark:text-white">Development</span>
                  </div>
                  <p className="text-sm text-gray-500 ml-8">Gunakan untuk pengembangan. Mem-bypass email produksi ke Mailpit.</p>
                </label>

                <label className={`flex-1 p-4 rounded-xl border cursor-pointer transition-all ${appMode === 'production' ? 'border-[#5000ef] bg-[#5000ef]/5' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'}`}>
                  <div className="flex items-center gap-3 mb-2">
                    <input 
                      type="radio" 
                      name="app_mode" 
                      value="production" 
                      checked={appMode === 'production'} 
                      onChange={(e) => setAppMode(e.target.value)}
                      className="w-5 h-5 text-[#5000ef]"
                    />
                    <span className="font-bold text-gray-900 dark:text-white">Production</span>
                  </div>
                  <p className="text-sm text-gray-500 ml-8">Mode rilis. Membuka akses penuh dan mengirim email nyata via SMTP.</p>
                </label>
              </div>
            </div>

            <hr className="border-gray-100 dark:border-gray-800" />

            <div>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Maintenance Mode</h2>
                  <p className="text-sm text-gray-500">Tutup akses aplikasi untuk pelanggan saat Anda melakukan pemeliharaan server.</p>
                </div>
                
                <label className="relative inline-flex items-center cursor-pointer mt-2">
                  <input type="checkbox" className="sr-only peer" checked={maintenanceMode} onChange={(e) => setMaintenanceMode(e.target.checked)} />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-red-500"></div>
                </label>
              </div>
              
              {maintenanceMode && (
                <div className="p-4 bg-red-50 text-red-700 rounded-xl border border-red-200 flex items-start gap-3">
                  <Wrench className="w-5 h-5 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="font-bold">Mode Pemeliharaan Aktif!</h4>
                    <p className="text-sm mt-1">Pelanggan tidak akan bisa mengakses halaman utama atau melakukan booking. Jangan lupa mematikannya kembali.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Email */}
        {activeTab === 'email' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Konfigurasi SMTP Email</h2>
              <p className="text-sm text-gray-500 mb-6">Atur server pengiriman email Anda (Gmail, Hostinger, dsb). Hanya aktif saat <strong>Production Mode</strong>.</p>
            </div>

            {appMode === 'development' ? (
              <div className="p-8 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl text-center">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Menggunakan Mailpit</h3>
                <p className="text-gray-500 max-w-sm mx-auto">Karena Anda berada di mode <strong>Development</strong>, seluruh email dialihkan secara lokal ke Mailpit (localhost:1025). Konfigurasi SMTP di bawah ini akan diabaikan.</p>
              </div>
            ) : null}

            <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${appMode === 'development' ? 'opacity-50 pointer-events-none grayscale' : ''}`}>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-gray-900 dark:text-white">SMTP Host</label>
                <input 
                  type="text" 
                  value={smtpConfig.host}
                  onChange={(e) => setSmtpConfig({...smtpConfig, host: e.target.value})}
                  className="px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-[#5000ef] transition-colors"
                  placeholder="smtp.gmail.com"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-gray-900 dark:text-white">SMTP Port</label>
                <input 
                  type="text" 
                  value={smtpConfig.port}
                  onChange={(e) => setSmtpConfig({...smtpConfig, port: e.target.value})}
                  className="px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-[#5000ef] transition-colors"
                  placeholder="465"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-gray-900 dark:text-white">SMTP User (Email)</label>
                <input 
                  type="email" 
                  value={smtpConfig.user}
                  onChange={(e) => setSmtpConfig({...smtpConfig, user: e.target.value})}
                  className="px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-[#5000ef] transition-colors"
                  placeholder="email@anda.com"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-gray-900 dark:text-white">SMTP Password</label>
                <input 
                  type="password" 
                  value={smtpConfig.pass}
                  onChange={(e) => setSmtpConfig({...smtpConfig, pass: e.target.value})}
                  className="px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-[#5000ef] transition-colors"
                  placeholder="••••••••••••"
                />
                <span className="text-xs text-gray-500">Gunakan App Password jika menggunakan Gmail.</span>
              </div>

              <div className="flex flex-col gap-2 md:col-span-2">
                <label className="text-sm font-bold text-gray-900 dark:text-white">Nama Pengirim (From)</label>
                <input 
                  type="text" 
                  value={smtpConfig.from}
                  onChange={(e) => setSmtpConfig({...smtpConfig, from: e.target.value})}
                  className="px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-[#5000ef] transition-colors"
                  placeholder='"Pasrent Store" <noreply@pasrent.com>'
                />
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800 flex justify-end">
          <button 
            onClick={handleSave}
            disabled={loading}
            className="bg-[#5000ef] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#4000c0] transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            Simpan Pengaturan
          </button>
        </div>

      </div>
    </div>
  );
}
