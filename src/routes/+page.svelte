<script lang="ts">
	import Background from "$lib/assets/hero-bg.svg";
	import Stars from "svelte-icons/wi/WiStars.svelte";
	import Modulable from "svelte-icons/fa/FaDrawPolygon.svelte";
	import Compass from "svelte-icons/fa/FaDraftingCompass.svelte";
</script>

<div class="hero" style:--bg={`url("${Background}")`}>
	<div class="text">
		<h1>Meet Desker</h1>
		<p>
			Your all-in-one tab manager, saver, and all of that synced to every
			devices
		</p>
	</div>

	<div class="video-presentation"></div>
</div>
<main>
	<section id="advantages">
		<h2>Desker advantages</h2>
		<ol>
			<li>
				<Compass />
				<p>Thought for productivity and time saving</p>
			</li>
			<li>
				<Stars />
				<p>Simple and minimal interface</p>
			</li>
			<li>
				<Modulable />
				<p>Very easy to use and to customize</p>
			</li>
		</ol>
	</section>
</main>

<style lang="scss">
	.hero {
		height: 75vh;
		background: var(--bg);
		background-size: cover;
		background-position: center;

		display: flex;
		align-items: center;
		justify-content: space-between;

		padding: 0 25px;

		color: var(--color-white);
		gap: 15px;

		> .text {
			> h1 {
				font-size: 50px;
			}
		}
	}

	main {
		background: linear-gradient(
			to bottom,
			var(--color-secondary-accent),
			var(--color-primary) 15px
		);
		padding: 15px 10px;

		> section {
			margin: 10px 0;
			> h2 {
				text-decoration: underline;
				margin-bottom: 15px;
			}
			&#advantages {
				> ol {
					list-style-position: inside;
					margin-left: 15px;
					> li {
						display: flex;
						align-items: center;
						gap: 10px;
						margin: 10px 0;
						:global(svg) {
							width: 18px;
						}
					}
				}
			}
		}
	}
</style>
