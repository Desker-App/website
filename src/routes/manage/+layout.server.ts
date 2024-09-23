import { getUserTokenFromCookies } from "$lib/linker.js";
import {
	getCustomerProducts,
	getCustomerSubscriptions,
} from "$lib/server/api/customer.js";
import { getUser, getUserFromToken } from "$lib/server/api/user.js";
import client from "$lib/server/stripe.js";
import { redirect } from "@sveltejs/kit";

export const load = async (event) => {
	const token = getUserTokenFromCookies(event);
	const user = await getUserFromToken(token).catch(() => null);
	if (!user || user.is_anonymous) throw redirect(303, `/link`);

	return {
		subscriptions: await getCustomerSubscriptions({
			desker_id: user.id,
		}).catch(() => []),
		products: await getCustomerProducts(
			{
				desker_id: user.id,
			},
			true
		)
			.then((p) =>
				Promise.all(
					p.map(async (product) => ({
						...product,
						price:
							typeof product.default_price === "string"
								? await client.prices.retrieve(
										product.default_price
								  )
								: product.default_price,
					}))
				)
			)
			.catch(() => []),
	};
};
