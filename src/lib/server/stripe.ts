import { Stripe } from "stripe";
const client = new Stripe(import.meta.env.STRIPE_API_KEY);
export default client;
