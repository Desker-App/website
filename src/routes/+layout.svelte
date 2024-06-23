<script lang="ts" context="module">
	let force_update = writable(0);
	export function updateAuth() {
		force_update.set(get(force_update) + 1);
	}
</script>

<script lang="ts">
	import "$lib/assets/scss/app.scss";
	import Header from "$lib/components/Header.svelte";
	import type { VerifyOtpParams } from "@supabase/supabase-js";
	import { onMount } from "svelte";
	import { askFor } from "$lib/message";
	import toast, { Toaster } from "svelte-french-toast";
	import { replaceState } from "$app/navigation";
	import { get, writable } from "svelte/store";
	import { goto } from "$app/navigation";

	onMount(async () => {
		if (location.hash) {
			const parameters = new URLSearchParams(location.hash.slice(1));
			console.log(
				"Detected parameters:",
				Object.fromEntries(parameters.entries())
			);

			if (parameters.get("error"))
				toast.error(
					`[${parameters.get("error")}]> ${parameters.get("error_description")}`
				);
			else {
				const type = parameters.get("type") as
					| VerifyOtpParams["type"]
					| null;
				switch (type) {
					case "email_change": {
						const { error } = await askFor("clearCache", {
							user: true,
						});

						if (error) toast.error("" + error.description);
						else {
							updateAuth();
							goto("/manage");
							toast.success(
								"Your account has been correctly linked to your new email address !"
							);
						}

						break;
					}

					default:
						console.error(
							"OTP detected but not currently supported."
						);
						toast.error("The request has not been processed.");
						break;
				}
			}

			replaceState("./", {});
		}
	});
</script>

<Toaster position="top-right" />

{#key $force_update}
	<Header />
	<slot />
{/key}
