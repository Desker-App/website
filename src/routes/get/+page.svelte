<script lang="ts">
	import { get_installation_url } from "$lib";
</script>

<svelte:head>
	<title>Get Desker now !</title>
</svelte:head>

<h1>Get the extension now</h1>
<p>And discover all the wells by its usage !</p>

<a href={get_installation_url()}>
	<button>Install now</button>
</a>
