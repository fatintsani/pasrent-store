import { createClient } from "@/utils/supabase/server";
import DashboardClient from "./dashboard-client";

export default async function AdminPage() {
  const supabase = await createClient();
  
  // 1. Total Revenue (Completed or Paid)
  const { data: revenueData } = await supabase
    .from("bookings")
    .select("total_price")
    .or("status.eq.completed,payment_status.eq.paid");
  
  const totalRevenue = revenueData?.reduce((sum, item) => sum + (Number(item.total_price) || 0), 0) || 0;

  // 2. Active Rentals
  const { count: activeRentalsCount } = await supabase
    .from("bookings")
    .select("*", { count: "exact", head: true })
    .eq("status", "in_progress");

  // 3. Available Units
  const { count: availableUnitsCount } = await supabase
    .from("units")
    .select("*", { count: "exact", head: true })
    .eq("status", "available");
    
  const { count: totalUnitsCount } = await supabase
    .from("units")
    .select("*", { count: "exact", head: true });

  // 4. Total Customers
  const { data: customersData } = await supabase
    .from("bookings")
    .select("customer_whatsapp");
    
  const uniqueCustomers = new Set(customersData?.map(c => c.customer_whatsapp)).size;

  // 5. Recent Transactions
  const { data: recentBookings } = await supabase
    .from("bookings")
    .select("id, booking_code, customer_name, total_price, status, created_at")
    .order("created_at", { ascending: false })
    .limit(5);

  // 6. Chart Data (Last 7 days revenue)
  const { data: chartRawData } = await supabase
    .from("bookings")
    .select("created_at, total_price")
    .or("status.eq.completed,payment_status.eq.paid")
    .order("created_at", { ascending: true });

  const chartData = processChartData(chartRawData || []);

  const stats = {
    totalRevenue,
    activeRentals: activeRentalsCount || 0,
    availableUnits: availableUnitsCount || 0,
    totalUnits: totalUnitsCount || 0,
    totalCustomers: uniqueCustomers
  };

  return <DashboardClient stats={stats} recentBookings={recentBookings || []} chartData={chartData} />;
}

function processChartData(data: any[]) {
  // Group by Date (YYYY-MM-DD)
  const grouped: Record<string, number> = {};
  
  // Create last 7 days array
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    grouped[dateStr] = 0;
  }

  data.forEach(item => {
    const dateStr = new Date(item.created_at).toISOString().split('T')[0];
    if (grouped[dateStr] !== undefined) {
      grouped[dateStr] += Number(item.total_price) || 0;
    }
  });

  return Object.keys(grouped).map(date => {
    const d = new Date(date);
    const formatted = d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
    return {
      name: formatted,
      revenue: grouped[date]
    };
  });
}
