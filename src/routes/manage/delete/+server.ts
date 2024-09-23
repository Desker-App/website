import { getUserTokenFromCookies } from "$lib/linker.js";
import {
	getUserFromToken,
	STRIPE_CUSTOMER_ID_METADATA_KEY,
} from "$lib/server/api/user.js";
import supabase_client from "$lib/server/supabase.js";
import stripe_client from "$lib/server/stripe.js";
import { error, redirect } from "@sveltejs/kit";
import type { toastParam } from "../../+layout.svelte";

export let GET = async (event) => {
	const token = getUserTokenFromCookies(event);
	const user = await getUserFromToken(token);

	const { error: _err } = await supabase_client
		.from("users")
		.delete()
		.order("id")
		.eq("id", user.id)
		.limit(1);
	if (_err) throw error(500, _err.message);

	const stripeCustomerID =
		user.user_metadata[STRIPE_CUSTOMER_ID_METADATA_KEY];
	if (typeof stripeCustomerID === "string")
		await stripe_client.customers.del(stripeCustomerID).catch(() => 0);

	throw redirect(
		301,
		new URL(
			`/?update&toast=${JSON.stringify({
				method: "success",
				message: "Your account has been permanently deleted.",
			} satisfies toastParam)}`,
      event.url
		)
	);
};
