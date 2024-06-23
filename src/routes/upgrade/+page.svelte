<script lang="ts">
	import type { PageData } from "./$types";
	import Product from "$lib/components/Product.svelte";
	import { askFor } from "$lib/message";

	export let data: PageData;
	console.log("Found products:", data.products);
</script>

<h1>Upgrade</h1>

<main>
	{#await askFor("user") then user}
		{@const user_plan = user.data?.user.plan}
		{#if user_plan}
			<ul>
				{#each data.products as { product, prices } (product.id)}
					<li>
						<Product {product} {prices} {user_plan} />
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
	ul {
		display: flex;
		align-items: stretch;
		justify-content: center;
		padding: 15px;
		gap: 15px;
    flex-wrap: wrap;
		list-style: none;
	}
</style>
