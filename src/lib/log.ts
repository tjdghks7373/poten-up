import { supabaseAdmin } from "./supabase";

export async function writeLog(action: string, entity: string, title: string) {
  await supabaseAdmin.from("admin_logs").insert({ action, entity, title });
}
