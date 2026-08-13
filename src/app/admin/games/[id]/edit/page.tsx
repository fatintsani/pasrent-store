import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import EditGameForm from "./edit-form";

export default async function EditGamePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: game, error } = await supabase
    .from("games")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !game) {
    notFound();
  }

  return <EditGameForm game={game} />;
}
