import { error } from "@sveltejs/kit";
import client from "../supabase";
import { getCustomerProducts } from "./customer";
import { browser } from "$app/environment";

export async function setPlan(user_id: string, plan: string) {
	const answer = await client
		.from("users")
		.update({
			plan,
		})
		.eq("id", user_id);
	if (answer.error) throw answer.error;
	return answer.data;
}

export async function updateUserPlan(user_id: string) {
	const products = await getCustomerProducts(
		{
			desker_id: user_id,
			deleted: "unlink",
		},
		true
	);

	if (!products.length) await setPlan(user_id, "demo");
	else if (products.length === 1)
		await setPlan(user_id, products[0].metadata.plan);
	else throw error(500, "Multiple product subscriptions detected.");
}
