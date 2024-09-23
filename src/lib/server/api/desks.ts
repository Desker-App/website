import { error } from "@sveltejs/kit";
import client from "../supabase";

export async function getUserDesks(user_id: string) {
  const { data, error: _err } = await client
    .from("desks")
    .select("*")
    .eq("user", user_id);
  if (_err) throw error(500, _err.message);
  return data.sort((a, b) => a.position - b.position);
}
