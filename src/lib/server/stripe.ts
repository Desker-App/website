import { Stripe } from "stripe";
import { STRIPE_API_KEY } from "$env/static/private";

const client = new Stripe(STRIPE_API_KEY);
export default client;
