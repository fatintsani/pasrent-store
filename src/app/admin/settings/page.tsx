import { getSettings } from "@/app/actions/admin/settings";
import SettingsClient from "./settings-client";

export default async function SettingsPage() {
  const { data: settings } = await getSettings();

  return (
    <div className="p-4 md:p-8 w-full max-w-5xl mx-auto space-y-6 animate-in fade-in duration-500 font-plus-jakarta">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2 text-gray-900 dark:text-white">Pengaturan Sistem</h1>
        <p className="text-muted-foreground">Kelola konfigurasi lingkungan, email, dan mode pemeliharaan aplikasi Anda.</p>
      </div>

      <SettingsClient initialSettings={settings || {}} />
    </div>
  );
}
