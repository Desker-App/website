<script lang="ts">
	import { goto } from "$app/navigation";
	import ManageForm from "$lib/components/ManageForm.svelte";
	import { askFor, type UserResponse } from "$lib/message";
	const userPromise = askFor<{ user: UserResponse }>("user").catch(() => {
		throw goto("/get");
	});
</script>

{#await userPromise}
	<h1>Récupération des informations...</h1>
{:then { data }}
	{#if data?.user}
		{@const { user } = data}
		{#if user.is_anonymous}
			<h1>Welcome to your dashboard !</h1>
			<p>
				Notice that you're currently not connected. This mean you can
				loose your desk at any time (due to session timeouts).
			</p>
			<p>
				We strongly recommend you to <a href="/signup">create</a> or
				<a href="signin">connect</a> your account before editing your extension.
			</p>
		{:else}
			<h1>
				Welcome to your dashboard, {user.user_metadata.username ||
					"unknow user"}
			</h1>
		{/if}

		<ManageForm {user} />
	{:else}
		<h1>Aouch...</h1>
		<p>An error has come... Please try to refresh the page!</p>
	{/if}
{/await}
