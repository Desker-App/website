<script lang="ts">
	import { afterNavigate, replaceState } from "$app/navigation";
	import { page } from "$app/stores";
	import { askFor } from "$lib/message";
	import AuthForm from "$lib/components/AuthForm.svelte";

	afterNavigate(() => {
		const current = /\w+/.exec($page.url.search)?.[0];
		if (current === "create" || current === "connect") {
			replaceState(`?${current}`, {
				linkType: current,
			});
		} else {
			replaceState("?create", {
				linkType: "create",
			});
		}
	});
</script>

<svelte:head>
	<title>Link your account - Desker</title>
</svelte:head>

{#await askFor("user") then { data }}
	<AuthForm user={data?.user} />
{/await}
