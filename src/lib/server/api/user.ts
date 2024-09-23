import { error } from "@sveltejs/kit";
import supabase_client from "../supabase";
export const STRIPE_CUSTOMER_ID_METADATA_KEY = "__stripe_customer";

export async function getUser(id: string) {
	const { error: _err, data } = await supabase_client.auth.admin.getUserById(
		id
	);
	if (_err) throw error(_err.status || 500, _err.message);
	return data.user;
}
export async function getUserFromToken(token: string) {
	const { error: _err, data } = await supabase_client.auth.getUser(token);
	if (_err) throw error(_err.status || 500, _err.message);
	return data.user;
}

export async function unlinkCustomer(desker_id: string) {
	const { user_metadata } = await getUser(desker_id);
	user_metadata[STRIPE_CUSTOMER_ID_METADATA_KEY] = null;

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
