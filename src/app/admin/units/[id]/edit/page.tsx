import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import EditUnitForm from "./edit-form";

export default async function EditUnitPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: unit, error } = await supabase
    .from("units")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !unit) {
    notFound();
  }

  return <EditUnitForm unit={unit} />;
}
