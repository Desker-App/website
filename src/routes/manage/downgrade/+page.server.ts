import client from "$lib/server/stripe.js";
import { error, redirect } from "@sveltejs/kit";

export const load = async ({ parent, url }) => {
	const { subscriptions } = await parent();
	const currentSubscription = subscriptions.find(
		({ id }) => id === url.searchParams.get("subscription")
	);
	if (!currentSubscription) throw error(404, "Invalid subscription given.");

	await client.subscriptions.cancel(currentSubscription.id);
	return redirect(303, new URL("./?update", url));
};
