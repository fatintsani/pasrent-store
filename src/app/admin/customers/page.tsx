import { getCustomers } from "@/app/actions/admin/customers";
import CustomersClient from "./customers-client";

export default async function CustomersPage() {
  const { data: customers, error } = await getCustomers();

  return (
    <div className="p-4 md:p-8 w-full max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500 font-plus-jakarta">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2 text-gray-900 dark:text-white">Daftar Pelanggan</h1>
        <p className="text-muted-foreground">Analitik dan direktori pelanggan yang pernah menyewa berdasarkan riwayat booking.</p>
      </div>

      <CustomersClient initialCustomers={customers || []} errorMsg={error} />
    </div>
  );
}
