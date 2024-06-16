<script lang="ts">
	import "$lib/assets/scss/app.scss";
	import Header from "$lib/components/Header.svelte";
	import type { VerifyOtpParams } from "@supabase/supabase-js";
	import { onMount } from "svelte";
	import { askFor } from "$lib/message";
	import toast, { Toaster } from "svelte-french-toast";
	import { replaceState } from "$app/navigation";

	const validOTPTypes: VerifyOtpParams["type"][] = [
		"email",
		"email_change",
		"invite",
		"magiclink",
		"phone_change",
		"recovery",
		"signup",
		"sms",
	];
	onMount(async () => {
		if (location.hash) {
			const parameters = new URLSearchParams(location.hash.slice(1));
			if (parameters.get("error"))
				toast.error(
					`[${parameters.get("error")}]> ${parameters.get("error_description")}`
				);
			else {
				const type = parameters.get("type");
				if (validOTPTypes.includes(type as any)) {
					const otpParams = Object.fromEntries(
						parameters.entries()
					) as unknown as VerifyOtpParams;
					console.log(otpParams);

					const { error } = await askFor("otp_signin", otpParams);
					if (error)
						toast.error(`[${error.title}]> ${error.description}`);
					else if (type === "email_change")
						toast.success(
							"Your account has been correctly linked to your new email !"
						);
				}
			}

			replaceState("./", {});
		}
	});
</script>

<Toaster position="top-right" />

<Header />
<slot />
