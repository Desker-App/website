import stripe_client from "$lib/server/stripe.js";
import supabase_client from "$lib/server/supabase.js";
import type { User } from "@supabase/supabase-js";
import { error } from "@sveltejs/kit";

export const HEAD = async ({ url: { searchParams } }) => {
	const user_id = searchParams.get("user_id");
	if (!user_id) throw error(401, "Missing the user_id parameter");
	const { error: userError, data } =
		await supabase_client.auth.admin.getUserById(user_id);
	if (userError) throw error(401, userError.message);

	async function setPlan(user_id: string, plan: string) {
		const { error: planUpdateError } = await supabase_client
			.from("users")
			.update({
				plan,
			})
			.eq("id", user_id);

		if (planUpdateError) throw error(500, planUpdateError.message);
	}

	const {
		user_metadata: { stripe_customer_id },
	} = data.user;
	if (typeof stripe_customer_id !== "string") {
		await setPlan(user_id, "demo");
		throw error(412, "Missing stripe customer id in the user metadata.");
	}

	async function invalidStripeUser(user: User): Promise<never> {
		await supabase_client.auth.admin.updateUserById(user.id, {
			user_metadata: {
				...user.user_metadata,
				stripe_customer_id: undefined,
			},
		});

		await setPlan(user.id, "demo");

		throw error(
			401,
			"The stripe customer associated to this user does not exists. Link has been destroyed."
		);
	}

	const customer = await stripe_client.customers
		.retrieve(stripe_customer_id, {
			expand: ["subscriptions"],
		})
		.catch((err) => {
			console.error(err);
			return invalidStripeUser(data.user);
		});
	if (customer.deleted) throw invalidStripeUser(data.user);

	const subscriptions = customer.subscriptions?.data;
	if (!subscriptions?.length) {
		await setPlan(user_id, "demo");
		return new Response(null);
	}

	const firstSubItems = subscriptions[0].items.data[0];
	const { product: productHandle } = firstSubItems.price;
	if (typeof productHandle !== "string")
		throw error(500, "Expected product to be a string");

	const product = await stripe_client.products.retrieve(productHandle);

	await setPlan(user_id, product.metadata.plan);
	return new Response(null);
};
