import { getCustomerSubscriptions } from "$lib/server/api/customer.js";
import { error, json } from "@sveltejs/kit";

export const GET = async ({ url }) => {
	const user_id = url.searchParams.get("user_id");
	if (!user_id) throw error(401, "Missing the user_id parameter");

	return json(
		getCustomerSubscriptions({
			desker_id: user_id,
		})
	);
};
