import { error } from "@sveltejs/kit";
import supabase_client from "../supabase";
import type { Database } from "$lib/types/supabase";
export const STRIPE_CUSTOMER_ID_METADATA_KEY = "__stripe_customer";

export async function getUser(id: string) {
	const { error: _err, data } = await supabase_client.auth.admin.getUserById(
		id
	);
	if (_err) throw error(_err.status || 500, _err.message);
	return data.user;
}

export async function getUserPlan(user_id: string) {
	const { error: _err, data: plan } = await supabase_client
		.from("users")
		.select("plan (*)")
		.eq("id", user_id)
		.maybeSingle();

	if (_err) throw error(500, _err);
	if (!plan?.plan)
		throw new Error("Failed to fetch plan. Try to reload the extension.");

	return plan.plan as unknown as Database["public"]["Tables"]["plans"]["Row"];
}

export async function unlinkCustomer(desker_id: string) {
	const { user_metadata } = await getUser(desker_id);
	delete user_metadata[STRIPE_CUSTOMER_ID_METADATA_KEY];

	const { error: _err } = await supabase_client.auth.admin.updateUserById(
		desker_id,
		{
			user_metadata,
		}
	);
	if (_err) throw error(_err.status || 500, _err.message);
}

export async function linkCustomer(desker_id: string, stripe_id: string) {
	const { user_metadata } = await getUser(desker_id);
	user_metadata[STRIPE_CUSTOMER_ID_METADATA_KEY] = stripe_id;

	const { error: _err } = await supabase_client.auth.admin.updateUserById(
		desker_id,
		{
			user_metadata,
		}
	);
	if (_err) throw error(_err.status || 500, _err.message);
}
