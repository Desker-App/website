<script lang="ts">
	import { type Answers, askFor as fetchAnswer } from "$lib/message";
	import { onMount } from "svelte";
	import { readonly, writable } from "svelte/store";
	type askForParameters = Parameters<typeof fetchAnswer>;

	export let askFor: askForParameters[0];
	export let withData: askForParameters[1] = undefined;
	export let withError: askForParameters[2] = undefined;

	const answered = writable<Awaited<
		ReturnType<typeof fetchAnswer<typeof askFor>>
	> | null>(null);
	export const answer = readonly(answered);

	onMount(async () => {
		$answered = await fetchAnswer(askFor, withData, withError);
	});
</script>

{#if !$answered}
	<p>Asking the extension for your data...</p>
{:else}
	<slot />
{/if}
