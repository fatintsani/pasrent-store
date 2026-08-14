import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import EditConsoleTypeForm from "./edit-form";

export default async function EditConsoleTypePage({ params }: { params: { id: string } }) {
  const supabase = await createClient();
  const { data: consoleType } = await supabase.from("console_types").select("*").eq("id", params.id).single();

  if (!consoleType) {
    notFound();
  }

  return <EditConsoleTypeForm consoleType={consoleType} />;
}
