<script lang="ts">
	import { goto } from "$app/navigation";
	import ManageForm from "$lib/components/ManageForm.svelte";
	import { onMount } from "svelte";
	import type { PageData } from "./$types";

	export let data: PageData;
	const { user } = data;
</script>

<svelte:head>
	<title>Manage your account - Desker</title>
</svelte:head>

<main>
	<h1>Welcome to your dashboard</h1>

	{#if user}
		<ManageForm {user} subscription={data.subscriptions?.[0]} />
	{:else}
		<h2>Oups...</h2>
		<p>An error has come. Please contact us !</p>
	{/if}
</main>

<style lang="scss">
	main {
		padding: 15px;
		> h1 {
			text-align: center;
		}
	}
</style>
