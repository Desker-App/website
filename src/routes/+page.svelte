<script lang="ts">
</script>

<div class="hero">
	<div class="text">
		<h1>Meet Desker</h1>
		<p>
			Your all-in-one tabs manager, saver, and all of that synced to every
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
				<p>Thought for productivity and time saving</p>
			</li>
			<li>
				<p>Simple and minimal interface</p>
			</li>
			<li>
				<p>Very easy to use and to customize</p>
			</li>
		</ol>
	</section>
</main>

<style lang="scss">
	.hero {
		height: 75vh;
		background: radial-gradient(
			circle at 15%,
			var(--color-primary),
			var(--color-secondary)
		);
		background-size: cover;
		background-position: 25% 95%;

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
		background-color: var(--color-primary);
		padding: 15px 10px;
		position: relative;

		&::before {
			content: "";
			position: absolute;
			bottom: 100%;
			left: 0;
			width: 100%;
			height: 15px;

			background: linear-gradient(
				to bottom,
				transparent,
				var(--color-primary)
			);
		}

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
