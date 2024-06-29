import stripe_client from "../stripe";
import supabase_client from "../supabase";
import { error } from "@sveltejs/kit";
import {
	getUser,
	linkCustomer,
	STRIPE_CUSTOMER_ID_METADATA_KEY,
	unlinkCustomer,
} from "./user";
import type Stripe from "stripe";
import type { User } from "@supabase/supabase-js";

interface getCustomerByDesker {
	desker_id: string;
	create_if_not_exists?: boolean;
}
export type customerGetterParams = (
	| {
			stripe_id: string;
			from_desker?: getCustomerByDesker;
	  }
	| getCustomerByDesker
) & {
	allow_deleted?: boolean;
};

export async function getCustomer<
	P extends customerGetterParams,
	Addition = P["allow_deleted"] extends true ? Stripe.DeletedCustomer : never,
	R = Stripe.Response<Stripe.Customer | Addition>
>(params: P, retreiveParams?: Stripe.CustomerRetrieveParams): Promise<R> {
	if ("stripe_id" in params) {
		const { stripe_id, from_desker } = params;
		const customer = await stripe_client.customers.retrieve(
			stripe_id,
			retreiveParams
		);

		if (customer.deleted && !params.allow_deleted) {
			if (from_desker) {
				if (from_desker.create_if_not_exists) {
					const { id } = await createCustomer(from_desker.desker_id);
					await linkCustomer(from_desker.desker_id, id);

					params["stripe_id"] = id;
					return getCustomer(params, retreiveParams);
				} else await unlinkCustomer(from_desker.desker_id);
			}

			throw error(401, `This user has been deleted.`);
		}

		return customer as R;
	}

	const { desker_id, create_if_not_exists } = params;
	const desker_user = await getUser(desker_id);

	const customer_id =
		desker_user.user_metadata[STRIPE_CUSTOMER_ID_METADATA_KEY];
	if (typeof customer_id !== "string") {
		await unlinkCustomer(desker_id);
		if (!create_if_not_exists)
			throw error(
				412,
				"User is not a customer yet (Customer creation has been disabled)"
			);

		const { id } = await createCustomer(desker_user);
		return getCustomer(
			{
				stripe_id: id,
				from_desker: params,
			},
			retreiveParams
		);
	}

	return getCustomer(
		{
			stripe_id: customer_id,
			from_desker: params,
		},
		retreiveParams
	);
}

export async function getDeskerUser(customer_id: string) {
	throw error(501);
}

export async function createCustomer(desker_user: string | User) {
	const { email, is_anonymous, user_metadata } =
		typeof desker_user === "string"
			? await getUser(desker_user)
			: desker_user;
	if (!email || is_anonymous)
		throw error(
			403,
			"Cannot create a customer from an unsigned Desker user."
		);

	return await stripe_client.customers.create({
		email,
		name: user_metadata.username,
	});
}

export async function getCustomerSubscriptions(
	getter:
		| {
				stripe_id: string;
		  }
		| {
				desker_id: string;
		  }
) {
	const customer = await getCustomer(getter, {
		expand: ["subscriptions"],
	});

	return customer.subscriptions?.data || [];
}

export async function getCustomerProducts<
	F extends boolean | undefined = undefined,
	Item = F extends true ? Stripe.Response<Stripe.Product> : string
>(
	getter:
		| {
				stripe_id: string;
		  }
		| {
				desker_id: string;
		  },
	fetch?: F
): Promise<Item[]> {
	const subscriptions = await getCustomerSubscriptions(getter);

	const product_ids: string[] = [];

	for (const subscription of subscriptions) {
		product_ids.push(
			...subscription.items.data.map((item) =>
				typeof item === "string" ? item : item.id
			)
		);
	}
	if (!fetch) return product_ids as Item[];
	else
		return Promise.all(
			product_ids.map((product_id) =>
				stripe_client.products.retrieve(product_id)
			)
		) as Promise<Item[]>;
}
