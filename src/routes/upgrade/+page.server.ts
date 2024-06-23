import client from "$lib/server/stripe";
import type Stripe from "stripe";

function getMonthlyPrice(prices: Stripe.Price[]) {
	return (
		prices.find((p) => p.recurring?.interval === "month")?.unit_amount ??
		NaN
	);
}

export const load = async () => {
	const products = await client.products.list();
	const prices = await client.prices.list();
	
	return {
		products: products.data
			.map((product) => {
				const affiliate_prices = prices.data.filter(
					(price) => price.product === product.id
				);
				return {
					product,
					prices: affiliate_prices,
				};
			})
			.sort(
				({ prices: p1 }, { prices: p2 }) =>
					getMonthlyPrice(p1) - getMonthlyPrice(p2)
			),
	};
};
