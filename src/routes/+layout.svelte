<script lang="ts">
	import "$lib/assets/scss/app.scss";
	import Header from "$lib/components/Header.svelte";
	import { onMount } from "svelte";
</script>

<Header />
<slot />
