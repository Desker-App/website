<script lang="ts">
	import { browser } from "$app/environment";
	import { get_installation_url } from "$lib";
	import Banner from "$lib/assets/brand/Banner.svg";
	import { askFor, type DeskerUser } from "$lib/message";

	export let user: DeskerUser | undefined;
	const is_anonymous = !user || user.is_anonymous;
</script>

<header>
	<a href="/">
		<img src={Banner} alt="Desker's banner" />
	</a>

	<nav>
		<ul>
			{#await askFor("ping") then}
				{#if is_anonymous}
					<li>
						<a href="/link?connect">Connect your account</a>
					</li>
				{/if}
				<li>
					<a href={is_anonymous ? "/link?create" : "/manage"}
						>{is_anonymous ? "Create" : "Manage"} your account</a
					>
				</li>
			{:catch}
				<li>
					{#if browser}
						<a href={get_installation_url()} target="_blank">
							<button type="button">Get the extension</button>
						</a>
					{/if}
				</li>
			{/await}
		</ul>
	</nav>
</header>

<style lang="scss">
	header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 10px;

		height: 75px;
		background-color: var(--color-primary);
		> a {
			height: 100%;
			> img {
				height: 100%;
			}
		}

		> nav {
			padding: 10px;
			border-radius: 10px;
			background-color: var(--color-white);

			display: flex;
			align-items: center;

			@media screen and (max-width: 524px) {
				display: none;
			}

			> ul {
				list-style: none;
				display: flex;
				align-items: center;
				gap: 15px;
			}
		}
	}
</style>
