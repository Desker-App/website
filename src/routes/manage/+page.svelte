<script lang="ts">
	import { goto } from "$app/navigation";
	import ManageForm from "$lib/components/ManageForm.svelte";
	import { askFor } from "$lib/message";
	const userPromise = askFor("user")
		.catch(() => {
			throw goto("/get");
		})
		.then(({ data }) => {
			data?.user?.is_anonymous && goto("/link");
			return data?.user;
		});
</script>

<svelte:head>
	<title>Manage your account - Desker</title>
</svelte:head>

{#await userPromise}
	<h1>Récupération des informations...</h1>
{:then user}
	{#if user}
		<h1>Welcome to your dashboard</h1>

		<ManageForm {user} />
	{:else}
		<h1>Aouch...</h1>
		<p>An error has come... Please try to refresh the page!</p>
	{/if}
{/await}
