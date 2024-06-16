<script lang="ts">
	import { askFor, type RequestsAnswers } from "$lib/message";
	import toast from "svelte-french-toast";
	import Form from "./Form.svelte";

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

<div id="danger">
	<h2>Danger Zone</h2>
	<button
		type="button"
		on:click={async () => {
			const { error } = await askFor("logout");
			if (error)
				return toast.error(`[${error.title}]> ${error.description}`);
			toast.success(
				"You've been logged out ! Website will reload in a few seconds..."
			);
			setTimeout(() => {
				document.location.reload();
			}, 2000);
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

				toast.success(
					"Your account has been deleted ! Website will reload in a few seconds..."
				);
				setTimeout(() => {
					document.location.reload();
				}, 2000);
			}
		}}>Delete Account</button
	>
</div>
