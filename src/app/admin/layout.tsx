import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard - Pasrent Store",
  description: "Pasrent Store Admin Dashboard",
};

import { createClient } from "@/utils/supabase/server";
import SidebarNavPreview from "@/components/ui/dashboard-sidebar";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen">
      <SidebarNavPreview user={user}>
        {children}
      </SidebarNavPreview>
    </div>
  );
}
