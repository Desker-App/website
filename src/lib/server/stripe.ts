import { Stripe } from "stripe";
import { STRIPE_API_KEY } from "$env/static/private";

console.log("Detected API KEY:", STRIPE_API_KEY);
if (!STRIPE_API_KEY) throw new Error("Invalid Stripe API KEY");

const client = new Stripe(STRIPE_API_KEY);
export default client;
