import { createClient } from "@/utils/supabase/server";
import GamesClient from "./games-client";

export default async function AdminGamesPage() {
  const supabase = await createClient();
  
  // Ambil semua data game
  const { data: games } = await supabase
    .from("games")
    .select("*")
    .order("name", { ascending: true });

  return <GamesClient initialGames={games || []} />;
}
