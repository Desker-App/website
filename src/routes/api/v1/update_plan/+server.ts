import { updateUserPlan } from "$lib/server/api/plan.js";
import { error } from "@sveltejs/kit";

export const HEAD = async ({ url: { searchParams } }) => {
	const user_id = searchParams.get("user_id");
	if (!user_id) throw error(401, "Missing the user_id parameter");
	await updateUserPlan(user_id);

	return new Response(null);
};
