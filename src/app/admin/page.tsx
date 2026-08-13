import { createClient } from "@/utils/supabase/server";

export default async function AdminPage() {
  const supabase = await createClient();
  
  // Basic stats for overview
  const { count: bookingsCount } = await supabase
    .from("bookings")
    .select("*", { count: "exact", head: true });

  const { count: unitsCount } = await supabase
    .from("units")
    .select("*", { count: "exact", head: true });

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold tracking-tight mb-8">Overview Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
          <p className="text-gray-500 text-sm font-medium mb-1">Total Pesanan</p>
          <p className="text-3xl font-bold text-[#5000ef] dark:text-[#00c3cb]">{bookingsCount || 0}</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
          <p className="text-gray-500 text-sm font-medium mb-1">Total Unit</p>
          <p className="text-3xl font-bold text-[#5000ef] dark:text-[#00c3cb]">{unitsCount || 0}</p>
        </div>
      </div>
    </div>
  );
}
