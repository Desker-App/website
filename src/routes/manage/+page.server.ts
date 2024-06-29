import { getUserIdFromCookies } from "$lib/linker.js";
import { getCustomerSubscriptions } from "$lib/server/api/customer.js";
import { getUser } from "$lib/server/api/user.js";
import { redirect } from "@sveltejs/kit";

export const load = async (event) => {
	const user_id = getUserIdFromCookies(event);
	const user = await getUser(user_id).catch(() => null);
	if (!user || user.is_anonymous) throw redirect(303, `/link`);

	return {
		subscriptions: await getCustomerSubscriptions({
			desker_id: user_id,
		}).catch(() => []),
	};
};
