import { getCustomerProducts } from "$lib/server/api/customer.js";
import { setPlan } from "$lib/server/api/plan.js";
import { error } from "@sveltejs/kit";

export const HEAD = async ({ url: { searchParams } }) => {
	const user_id = searchParams.get("user_id");
	if (!user_id) throw error(401, "Missing the user_id parameter");

	const products = await getCustomerProducts(
		{
			desker_id: user_id,
		},
		true
	);

	if (!products.length) await setPlan(user_id, "demo");
	else if (products.length === 1)
		await setPlan(user_id, products[0].metadata.plan);
	else throw error(500, "Multiple product subscriptions detected.");

	return new Response(null);
};
