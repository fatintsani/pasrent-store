import { getUsers } from "@/app/actions/admin/users";
import UsersClient from "./users-client";
import { createClient } from "@/utils/supabase/server";

export default async function UsersPage() {
  // Dapatkan ID pengguna yang sedang login saat ini agar tidak bisa menghapus diri sendiri
  const supabase = await createClient();
  const { data: { user: currentUser } } = await supabase.auth.getUser();

  const { data: users, error } = await getUsers();

  return (
    <div className="p-4 md:p-8 w-full max-w-5xl mx-auto space-y-6 animate-in fade-in duration-500 font-plus-jakarta">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2 text-gray-900 dark:text-white">Akun Admin</h1>
        <p className="text-muted-foreground">Kelola siapa saja yang memiliki akses untuk masuk ke dasbor administrator ini.</p>
      </div>

      <UsersClient 
        initialUsers={users || []} 
        errorMsg={error} 
        currentUserId={currentUser?.id || ""} 
      />
    </div>
  );
}
