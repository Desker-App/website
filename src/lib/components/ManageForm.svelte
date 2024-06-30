<script lang="ts">
	import {
		askFor,
		type DeskerUser,
		type RequestsAnswers,
	} from "$lib/message";
	import toast from "svelte-french-toast";
	import Form from "./Form.svelte";
	import { goto } from "$app/navigation";
	import { updateAuth } from "../../routes/+layout.svelte";
	import type Stripe from "stripe";

	export let user: DeskerUser;
	export let subscription: Stripe.Subscription | undefined = undefined;
</script>

<section id="account">
	<h2>Your account</h2>

	<Form
		onSubmit={async (data) => {
			const username = data.get("username")?.toString();
			const { error } = await askFor("updateuser", {
				data: {
					data: {
						username,
					},
				},
			});
			if (error) {
				console.error(error);
				toast.error("Failed to save your info...");
			} else toast.success("Your info has been saved !");
		}}
	>
		<label for="username">
			Username
			<input
				type="text"
				name="username"
				id="username"
				placeholder="Enter your wanted username"
				value={user.user_metadata.username || ""}
				required
			/>
		</label>

		<button type="submit">Save changes</button>
	</Form>
</section>

<section id="plan">
	<h2>Current plan</h2>
	<table>
		<thead>
			<tr>
				<th>Name</th>
				<th>Desk limit</th>
			</tr>
		</thead>

		<tbody>
			<tr>
				<td>{user.plan.name}</td>
				<td>{user.plan.desks_limit || "Unlimited"}</td>
			</tr>
		</tbody>
	</table>
	<a href="/upgrade">
		<button type="button">Upgrade</button>
	</a>

	{#if subscription}
		<a href="/downgrade">
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
			if (error)
				return toast.error(`[${error.title}]> ${error.description}`);
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
			if (confirmed) {
				const { error } = await askFor("deleteuser");
				if (error)
					return toast.error(
						`[${error.title}]> ${error.description}`
					);

				updateAuth();
				goto("/");
				toast.success("Your account has been deleted !");
			}
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
