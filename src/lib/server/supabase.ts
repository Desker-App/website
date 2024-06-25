import { SUPABASE_API_KEY } from "$env/static/private";
import { type Database } from "$lib/types/supabase";
import pkg from "@supabase/supabase-js";
const { SupabaseClient } = pkg;

const client = new SupabaseClient<Database>(
	"https://amaxeglrxldshzzfistf.supabase.co",
	SUPABASE_API_KEY
);
export default client;
