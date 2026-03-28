import { supabaseAdmin } from "@/lib/supabase";
import LogsView from "./LogsView";

export const dynamic = "force-dynamic";

export default async function LogsPage() {
  const { data } = await supabaseAdmin
    .from("admin_logs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200);

  return <LogsView logs={data ?? []} />;
}
