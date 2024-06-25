<script lang="ts">
	import type { PageData } from "./$types";
	import Product from "$lib/components/Product.svelte";
	import { askFor } from "$lib/message";

	export let data: PageData;
	let yearly_period: boolean = false;

	console.log("Found products:", data.products);
</script>

<h1>Upgrade</h1>

<main>
	{#await askFor("user") then raw}
		{@const user = raw.data?.user}
		{#if user}
			<h2>Price periode</h2>
			<div class="selector">
				<span>Monthly</span>
				<input type="checkbox" bind:checked={yearly_period} />
				<span>Yearly</span>
			</div>

			<h2>Plans</h2>
			<ul>
				{#each data.products as { product, prices } (product.id)}
					<li>
						<Product
							{product}
							{prices}
							{user}
							price_period={yearly_period ? "year" : "month"}
						/>
					</li>
				{/each}
			</ul>
		{:else}
			<h2>Oups...</h2>
			<p>Sorry, we were unable to get your active plan.</p>
		{/if}
	{/await}
</main>

<style lang="scss">
	main {
		display: flex;
		align-items: center;
		flex-direction: column;
		justify-content: center;
		> h2 {
			margin-top: 25px;
		}

		> .selector {
			margin-top: 15px;
			display: grid;
			grid-template-columns: 1fr 50px 1fr;
			gap: 15px;

			> input {
				appearance: none;
				height: 100%;
				width: 100%;
				border-style: solid;
				border-color: var(--color-secondary-accent);
				border-radius: 999px;
				background-color: var(--color-secondary);
				position: relative;
				cursor: pointer;

				&::before,
				&::after {
					content: "";
					position: absolute;
					top: 0;
					left: 0;
					height: 100%;
					aspect-ratio: 1 / 1;
					transition: 0.5s;
				}
				&::before {
					background-color: var(--color-secondary-accent);
					border-radius: 999px;
				}
				&::after {
					clip-path: polygon(
						40% 0%,
						40% 20%,
						100% 20%,
						100% 80%,
						40% 80%,
						40% 100%,
						0% 50%
					);
					background-color: var(--color-white);
					scale: 0.5;
					transform-origin: center center;
				}

				&:checked {
					&::before,
					&::after {
						left: 100%;
						translate: -100% 0;
					}
					&::after {
						rotate: 180deg;
					}
				}
			}
		}

		> ul {
			display: flex;
			align-items: stretch;
			justify-content: center;
			padding: 15px;
			gap: 15px;
			flex-wrap: wrap;
			list-style: none;
		}
	}
</style>
