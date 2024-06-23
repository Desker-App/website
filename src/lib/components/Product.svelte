<script lang="ts">
	import type Stripe from "stripe";
	import Price from "./Price.svelte";
	import type { Database } from "$lib/types/supabase";
	import toast from "svelte-french-toast";

	export let product: Stripe.Product;
	export let prices: Stripe.Price[];
	export let user_plan: Database["public"]["Tables"]["plans"]["Row"];
	export let price_period: "month" | "year" = "month";
	export let most_selected: boolean = false;

	$: selected_price = prices.find(
		(price) => price.recurring?.interval === price_period
	);
	$: product_selected = product.metadata["plan"] === user_plan.id;
</script>

<section id={product.id} class:most_selected class:selected={product_selected}>
	<h3>{product.name}</h3>
	{#if selected_price}
		<div class="price">
			<Price price={selected_price} />
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
	{:else}
		<button
			type="button"
			on:click={() => {
				toast.error("This feature is not implemented yet !");
			}}>Upgrade</button
		>
	{/if}
</section>

<style lang="scss">
	section {
		border: 1px solid var(--color-primary);
		padding: 10px 15px;

		display: flex;
		flex-direction: column;
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
