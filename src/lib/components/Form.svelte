<script lang="ts">
	import type { MaybePromise } from "@sveltejs/kit";

	let submiting = false;
	export let onSubmit: (
		data: FormData,
		target: EventTarget & HTMLFormElement
	) => MaybePromise<any>;
</script>

<form
	method="dialog"
	inert={submiting}
	on:submit|preventDefault={async ({ currentTarget }) => {
		submiting = true;
		await onSubmit(new FormData(currentTarget), currentTarget);
		submiting = false;
	}}
>
	<slot />
</form>

<style lang="scss">
	form {
		transition: opacity 0.15s;
		&[inert="true"] {
			opacity: 0.5;
		}
	}
</style>
