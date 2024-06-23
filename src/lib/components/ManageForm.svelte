<script lang="ts">
	import { askFor, type RequestsAnswers } from "$lib/message";
	import toast from "svelte-french-toast";
	import Form from "./Form.svelte";
	import { goto } from "$app/navigation";
	import { updateAuth } from "../../routes/+layout.svelte";

	export let user: RequestsAnswers["user"]["answerData"]["user"];
</script>

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

<div id="plan">
	<h2>Currently plan</h2>
	<table>
		<thead>
			<tr>
				<th>Name</th>
				<th>Desk limit</th>
			</tr>
		</thead>

		<tbody>
			<tr>
				<td>{user.plan.title}</td>
				<td>{user.plan.desks_limit || "Unlimited"}</td>
			</tr>
		</tbody>
	</table>
	<a href="/upgrade"><button type="button">Upgrade</button></a>
</div>

<div id="danger">
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
</div>
