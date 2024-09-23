import { error } from "@sveltejs/kit";
import client from "../supabase";
import { getCustomerProducts } from "./customer";
import type { Database } from "$lib/types/supabase";

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
	).catch(() => []);

	if (!products.length) await setPlan(user_id, "demo");
	else if (products.length === 1)
		await setPlan(user_id, products[0].metadata.plan);
	else throw error(500, "Multiple product subscriptions detected.");
}

export async function getUserPlan(user_id: string) {
	const { error: _err, data: plan } = await client
		.from("users")
		.select("plan (*)")
		.eq("id", user_id)
		.maybeSingle();

	if (_err) throw error(500, _err);
	if (!plan?.plan)
		throw new Error("Failed to fetch plan. Try to reload the extension.");

	return plan.plan as unknown as Database["public"]["Tables"]["plans"]["Row"];
}
