<script lang="ts">
	import type Stripe from "stripe";
	export let price: Stripe.Price;

	$: value = (price.unit_amount ?? NaN) / 100;
	const formater = new Intl.NumberFormat("fr-FR", {
		currency: price.currency,
		style: "currency",
	});
</script>

<span class="price">
	{formater.format(value)}
</span>

<style lang="scss">
  .price {
    font-style: italic;
  }
</style>
