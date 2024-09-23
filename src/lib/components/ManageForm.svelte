<script lang="ts">
  import { askFor, type DeskerUser, type RequestsAnswers } from "$lib/message";
  import toast from "svelte-french-toast";
  import Form from "./Form.svelte";
  import { goto } from "$app/navigation";
  import { updateAuth } from "../../routes/+layout.svelte";
  import type Stripe from "stripe";
  import Price from "./Price.svelte";

  export let user: DeskerUser;
  export let subscription: Stripe.Subscription | undefined = undefined;
  export let product:
    | (Stripe.Product & {
        price?: Stripe.Price | null;
      })
    | undefined = undefined;
</script>

<section id="account">
  <h2>Your account</h2>

  <Form
    onSubmit={async (data) => {
      const display_name = data.get("username")?.toString();

      const answer = new Promise(async (res, rej) => {
        const { error } = await askFor("updateuser", {
          data: {
            data: {
              display_name,
            },
          },
        });
        if (error) rej(error.title);
        else res(true);
      });

      toast.promise(answer, {
        loading: "Saving your informations...",
        error: (reason) => `Cannot save : ${reason}`,
        success: "Your informations has been saved !",
      });
    }}
  >
    <label for="username">
      Username
      <input
        type="text"
        name="username"
        id="username"
        placeholder="Enter your wanted username"
        value={user.user_metadata.display_name || ""}
        required
      />
    </label>

    <button type="submit">Save changes</button>
  </Form>

  <a href="/manage/get_data" download={`${user.user_metadata.display_name || "your"}_data.json`}>Download my data</a>
</section>

<section id="plan">
  <h2>Current plan</h2>
  <table>
    <thead>
      <tr>
        <th>Name</th>
        <th>Desk limit</th>
        {#if product?.price}
          <th>Price (per {product.price.recurring?.interval})</th>
        {/if}
      </tr>
    </thead>

    <tbody>
      <tr>
        <td>{user.plan.name}</td>
        <td>{user.plan.desks_limit || "Unlimited"}</td>
        {#if product?.price}
          <td>
            <Price price={product.price} />
          </td>
        {/if}
      </tr>
    </tbody>
  </table>
  <a href="/upgrade">
    <button type="button">Upgrade</button>
  </a>

  {#if subscription}
    <a
      href="/manage/downgrade?subscription={subscription.id}"
      data-sveltekit-preload-data="off"
    >
      <button type="button">Revoke subscription</button>
    </a>
  {/if}
</section>

<section id="danger">
  <h2>Danger Zone</h2>
  <button
    type="button"
    on:click={async () => {
      const { error } = await askFor("logout");
      if (error) return toast.error(`[${error.title}]> ${error.description}`);
      updateAuth();
      goto("/");
      toast.success("You've been logged out !");
    }}>Logout</button
  >
  <button
    type="button"
    on:click={async () => {
      const confirmed = confirm(
        "Are you sure you want to delete your account ? This action is not reversible."
      );
      if (confirmed) goto("/manage/delete");
    }}>Delete Account</button
  >
</section>

<style lang="scss">
  section {
    max-width: 850px;
    margin: 15px auto;
    border: 1.5px double var(--color-secondary);
    padding: 15px;

    > h2 {
      margin-bottom: 10px;
    }

    label {
      display: flex;
      align-items: center;
      gap: 15px;
    }
    button {
      display: block;
      margin: 15px 0;
    }

    &#danger {
      color: red;
    }
  }
</style>
