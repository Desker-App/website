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

<style lang="scss">
	footer {
		padding: 15px 10px;

		ul {
			list-style: none;
	
			display: flex;
			align-items: center;
			justify-content: center;
			gap: 15px;
		}
	}
</style>