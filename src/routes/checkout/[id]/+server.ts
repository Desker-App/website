import { getUserTokenFromCookies } from "$lib/linker.js";
import { getCustomer } from "$lib/server/api/customer.js";
import { getUserFromToken } from "$lib/server/api/user.js";
import stripe_client from "$lib/server/stripe";
import { error, redirect } from "@sveltejs/kit";

export let GET = async ({ params: { id }, url, cookies }) => {
	const price = await stripe_client.prices.retrieve(id).catch(() => {
		throw error(404, "The product has not been found.");
	});

	const token = getUserTokenFromCookies({ cookies, url });
	const user = await getUserFromToken(token);

	const customer = await getCustomer({
		desker_id: user.id,
		create_if_not_exists: true,
	});

	const success_url = new URL(`/manage?update`, url);
	const cancel_url = new URL("/upgrade?canceled", url);

	const billing_session = await stripe_client.checkout.sessions.create({
		line_items: [
			{
				price: price.id,
				quantity: 1,
			},
		],
		mode: "subscription",
		customer: customer.id,
		client_reference_id: user.id,
		success_url: success_url.toString(),
		cancel_url: cancel_url.toString(),
		allow_promotion_codes: true,
	});
	const { url: billing_url } = billing_session;

	if (!billing_url)
		throw error(
			500,
			"Failed to generate a billing session for selected product."
		);

	throw redirect(303, billing_url);
};
