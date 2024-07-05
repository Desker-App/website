<script lang="ts">
	const policies = ["cgu", "cgv", "legals-mentions"];
</script>

<footer>
	<ul>
		{#each policies as policy}
			<li>
				<a href="/policies/{policy}">{policy.toUpperCase()}</a>
			</li>
		{/each}
	</ul>
</footer>
