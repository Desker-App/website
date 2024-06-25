import stripe_client from "$lib/server/stripe";
import supabase_client from "$lib/server/supabase.js";
import { error, redirect } from "@sveltejs/kit";

export let GET = async ({ params: { id }, url }) => {
	const price = await stripe_client.prices.retrieve(id).catch(() => {
		throw error(404, "The product has not been found.");
	});

	const user_id = url.searchParams.get("user_id");
	if (!user_id) throw error(400, "User id has not been set.");

	const result = await supabase_client.auth.admin.getUserById(user_id);
	if (result.error) throw error(401, result.error.message);
	const { email, is_anonymous, user_metadata } = result.data.user;
	if (!email || is_anonymous)
		throw error(403, "You must have a valid account to perform checkout.");

	let stripe_customer_id: string | undefined =
		user_metadata.stripe_customer_id;
	if (stripe_customer_id) {
		await stripe_client.customers.update(stripe_customer_id, {
			email,
			name: user_metadata.username,
		});
	} else {
		const new_customer = await stripe_client.customers.create({
			email,
			name: user_metadata.username,
		});
		stripe_customer_id = new_customer.id;
	}

	const success_url = new URL(`/manage?update`, url);
	const cancel_url = new URL("/upgrade", url);

	const billing_session = await stripe_client.checkout.sessions.create({
		line_items: [
			{
				price: price.id,
				quantity: 1,
			},
		],
		mode: "subscription",
		customer: stripe_customer_id,
		client_reference_id: user_id,
		success_url: success_url.toString(),
		cancel_url: cancel_url.toString(),
		allow_promotion_codes: true,
	});
	const { customer, url: billing_url } = billing_session;

	if (customer) {
		const customer_id =
			typeof customer === "string" ? customer : customer.id;
		const customer_deleted = !!(
			typeof customer !== "string" && customer.deleted
		);

		const { error: updateError } =
			await supabase_client.auth.admin.updateUserById(user_id, {
				user_metadata: {
					...user_metadata,
					stripe_customer_id: customer_deleted
						? undefined
						: customer_id,
				},
			});

		if (updateError) throw error(500, updateError.message);
	}

	if (!billing_url)
		throw error(
			500,
			"Failed to generate a billing session for selected product."
		);
	throw redirect(303, billing_url);
};
