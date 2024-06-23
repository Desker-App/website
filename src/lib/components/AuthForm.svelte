<script lang="ts">
	import { goto, replaceState } from "$app/navigation";
	import { page } from "$app/stores";
	import { askFor, type RequestsAnswers } from "$lib/message";
	import toast from "svelte-french-toast";
	import Form from "./Form.svelte";
	import { updateAuth } from "../../routes/+layout.svelte";
	export let user: RequestsAnswers["user"]["answerData"]["user"] | undefined =
		undefined;

	let showMailboxCheckMessage = user?.email && !user.confirmed_at;
	async function formSubmited(data: FormData) {
		const email = data.get("email")?.toString();
		const password = data.get("password")?.toString();
		const username = data.get("username")?.toString();

		if ($page.state.linkType === "create") {
			if (!(email && password))
				return toast.error(
					"Please provide at least an email and a password !"
				);

			const { error } = await askFor("signup", {
				email,
				password,
				username,
			}).catch(() => ({
				error: {
					title: "Extension didn't answered.",
					description: "Try to check your internet connection ?",
				},
			}));
			if (error) {
				console.error(error);

				return toast.error(`[${error.title}]> ${error.description}`);
			} else {
				showMailboxCheckMessage = true;
				return toast.success(
					"Please check your mailbox to finalize your account creation."
				);
			}
		} else {
			if (!(email && password))
				return toast.error(
					"Please provide your email address and password."
				);

			const { error } = await askFor("signin", {
				email,
				password,
			}).catch(() => ({
				error: {
					title: "Extension doesn't answered.",
					description: "Try to check your internet connection ?",
				},
			}));
			if (error) {
				console.error(error);

				return toast.error(`[${error.title}]> ${error.description}`);
			} else {
				updateAuth();
				goto("/manage");
				toast.success(
					"Congratulation ! You're now connected !"
				);
			}
		}
	}
</script>

<Form onSubmit={formSubmited}>
	<div class="form-inner">
		{#if showMailboxCheckMessage}
			<h2>Check your mailbox !</h2>
			<p>
				Your account has been created. But you need to confirm your mail
				address.
			</p>
		{:else if user && !user.is_anonymous}
			<h2>Already connected !</h2>
			<p>You're already connected to your account.</p>
			<p>
				If you want to connect to another account, please go to your <a
					href="/manage">account manager</a
				> and logout !
			</p>
		{:else if $page.state.linkType === "create"}
			<h2>Create your account</h2>

			<label for="username">
				Username
				<input
					type="text"
					name="username"
					id="username"
					autocomplete="username"
					placeholder="Choose an username (you can change it later)"
				/>
			</label>
			<label for="email">
				Email address
				<input
					type="email"
					name="email"
					id="email"
					placeholder="exemple@domain.com"
					autocomplete="email"
					required
				/>
			</label>
			<label for="password">
				Password
				<input
					type="password"
					name="password"
					id="password"
					autocomplete="new-password"
					placeholder="Create your password"
					required
				/>
			</label>

			<button type="submit">Create and link</button>
			<a href="?connect">Already have an account ?</a>
		{:else if $page.state.linkType === "connect"}
			<h2>Connect to an existing account</h2>

			{#await askFor("desks") then { data }}
				{#if data?.desks.length}
					<div class="warning">
						<h3>Be aware !</h3>
						<p>
							Notice that you've desks saved in your extension,
							and they will be destroyed after you've login to
							your account.
						</p>
						<p>
							To avoid this, we recommend you to create a new
							account.
						</p>
					</div>
				{/if}
			{/await}

			<label for="email">
				Email address
				<input
					type="email"
					name="email"
					id="email"
					autocomplete="email"
					placeholder="exemple@domain.com"
					required
				/>
			</label>
			<label for="password">
				Password
				<input
					type="password"
					name="password"
					id="password"
					autocomplete="current-password"
					placeholder="Enter your password"
					required
				/>
			</label>

			<button type="submit">Connect and link</button>
			<a href="./reset-psw">Forgot your password ?</a>
			<a href="./link?create">Don't have an account ?</a>
		{:else}
			<h2>Oups... An error occured.</h2>
			<button
				type="button"
				on:click={() =>
					replaceState("", {
						linkType: "create",
					})}>Try to fix it...</button
			>
		{/if}
	</div>
</Form>

<style lang="scss">
	.form-inner {
		max-width: 750px;
		margin: 0 auto;
		padding: 15px;

		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: flex-start;

		gap: 15px;

		> .warning {
			padding: 10px 15px;
			background-color: var(--color-primary);
			border-radius: 5px;
			font-size: 12.5px;
			width: 100%;
			> h3 {
				font-size: 25px;
			}
		}

		> h2 {
			margin-bottom: 20px;
		}

		> button {
			width: 100%;
		}
		> a {
			display: inline-block;
			margin: 0 auto;
		}
		> label {
			display: flex;
			align-items: center;
			justify-content: stretch;
			gap: 25px;
			width: 100%;

			> input {
				flex-grow: 1;
			}
		}
	}
</style>
