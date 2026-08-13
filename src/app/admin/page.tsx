import SidebarNavPreview from "@/components/ui/dashboard-sidebar";
import { createClient } from "@/utils/supabase/server";

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen">
      <SidebarNavPreview user={user} />
    </div>
  );
}
