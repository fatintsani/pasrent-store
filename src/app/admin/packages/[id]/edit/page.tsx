import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import EditPackageForm from "./edit-form";

export default async function EditPackagePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: pkg, error } = await supabase
    .from("rental_packages")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !pkg) {
    notFound();
  }

  return <EditPackageForm pkg={pkg} />;
}
