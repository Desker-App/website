import { getUserTokenFromCookies } from "$lib/linker.js";
import {
  getCustomer,
  getCustomerSubscriptions,
} from "$lib/server/api/customer.js";
import { getUserDesks } from "$lib/server/api/desks.js";
import { getUserPlan } from "$lib/server/api/plan.js";
import { getUserFromToken } from "$lib/server/api/user.js";
import { json } from "@sveltejs/kit";

export const GET = async (e) => {
  const user = await getUserFromToken(getUserTokenFromCookies(e));
  const plan = await getUserPlan(user.id);
  const desks = await getUserDesks(user.id);

  const stripe = {
    customer: await getCustomer({
      desker_id: user.id,
      create_if_not_exists: false,
    }).catch(() => "not_created"),
    subscription: await getCustomerSubscriptions({
      desker_id: user.id,
      create_if_not_exists: false,
    }).catch(() => "not_created"),
  };

  return json({ user, desks, plan, stripe });
};
