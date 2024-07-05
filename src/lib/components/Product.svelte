<script lang="ts">
	import type Stripe from "stripe";
	import Price from "./Price.svelte";
	import type { DeskerUser } from "$lib/message";

	export let product: Stripe.Product;
	export let prices: Stripe.Price[];
	export let user: DeskerUser;
	export let price_period: "month" | "year" = "month";
	export let most_selected: boolean = false;

	$: selected_price =
		price_period &&
		prices.find((price) => price.recurring?.interval === price_period);
	$: product_selected = product.metadata["plan"] === user.plan.name;
</script>

<section id={product.id} class:most_selected class:selected={product_selected}>
	<h3>{product.name}</h3>
	{#if selected_price}
		<div class="price">
			<Price price={selected_price} /> / {price_period.slice(0, 2)}
		</div>
	{/if}

	<h4>Features :</h4>
	<ol>
		{#each product.marketing_features as feature}
			<li>{feature.name}</li>
		{/each}
	</ol>

	{#if product_selected}
		<p>This is your active product !</p>
	{:else if selected_price}
		<a href="/checkout/{selected_price.id}">
			<button type="button">Upgrade</button>
		</a>
	{:else}
		<p>An error has come with this product.</p>
	{/if}
</section>

<style lang="scss">
	section {
		border: 1px solid var(--color-primary);
		padding: 10px 15px;

		display: flex;
		flex-direction: column;
		align-items: flex-start;
		width: 325px;

		aspect-ratio: 1.5 / 2;

		> h3 {
			text-align: center;
		}
		> .price {
			text-align: right;
		}
		> h4 {
			margin-top: 15px;
		}
		> ol {
			flex-grow: 1;
			margin-bottom: 15px;
			list-style-position: inside;
		}
	}
</style>
