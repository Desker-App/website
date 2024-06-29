import client from "../supabase";

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
