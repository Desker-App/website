<script lang="ts">
	import { afterNavigate, replaceState } from "$app/navigation";
	import { page } from "$app/stores";
	import AuthForm from "$lib/components/AuthForm.svelte";
	import type { PageData } from "../$types";

	export let data: PageData;
	let redirect: string | undefined = undefined;

	afterNavigate(() => {
		redirect = $page.url.searchParams.get("redirect") || undefined;

		const current = $page.url.searchParams.has("connect") ? "connect" : "create";
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

<AuthForm user={data?.user} {redirect} />
