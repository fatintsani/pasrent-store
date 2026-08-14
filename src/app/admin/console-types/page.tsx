import { createClient } from "@/utils/supabase/server";
import ConsoleTypesClient from "./console-types-client";

export default async function AdminConsoleTypesPage() {
  const supabase = await createClient();
  const { data: consoleTypes } = await supabase.from("console_types").select("*").order("code");

  return <ConsoleTypesClient initialConsoleTypes={consoleTypes || []} />;
}
