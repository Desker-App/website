import { getUserIdFromCookies } from "$lib/linker.js";
import type { DeskerUser } from "$lib/message.js";
import { getCustomer } from "$lib/server/api/customer.js";
import { updateUserPlan } from "$lib/server/api/plan.js";
import { getUser, getUserPlan } from "$lib/server/api/user.js";
import type Stripe from "stripe";

export const load = async (
	event
): Promise<{
	user?: DeskerUser;
	stripe?: Stripe.Customer;
}> => {
	const user_id = getUserIdFromCookies(event, true);
	if (!user_id) return {};
	if (event.url.searchParams.has("update")) await updateUserPlan(user_id);

	return {
		user: await getUser(user_id).then(async (user) => {
			return {
				...user,
				plan: await getUserPlan(user.id),
			};
		}),
		stripe: await getCustomer({
			desker_id: user_id,
			create_if_not_exists: false,
			deleted: "unlink",
		}).catch(() => undefined),
	};
};
