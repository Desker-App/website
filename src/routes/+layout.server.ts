import { getUserTokenFromCookies } from "$lib/linker.js";
import type { DeskerUser } from "$lib/message.js";
import { getCustomer } from "$lib/server/api/customer.js";
import { getUserPlan, updateUserPlan } from "$lib/server/api/plan.js";
import {
	getUser,
	getUserFromToken,
} from "$lib/server/api/user.js";
import type Stripe from "stripe";

export const load = async (
	event
): Promise<{
	user?: DeskerUser;
	stripe?: Stripe.Customer;
}> => {
	const token = getUserTokenFromCookies(event, true);
	if (!token) return {};
	const user = await getUserFromToken(token).catch(() => null);
	if (!user) return {};
	if (event.url.searchParams.has("update")) await updateUserPlan(user.id);

	return {
		user: await getUser(user.id).then(async (user) => {
			return {
				...user,
				plan: await getUserPlan(user.id),
			};
		}),
		stripe: await getCustomer({
			desker_id: user.id,
			create_if_not_exists: false,
			deleted: "unlink",
		}).catch(() => undefined),
	};
};
