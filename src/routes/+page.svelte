<script lang="ts">
	import DeskerBanner from "$lib/assets/brand/Banner.svg";
</script>

<svelte:head>
	<title>Desker : your all-in-one tabs manager and saver</title>
</svelte:head>

<div class="hero">
	<div class="text">
		<h1>Meet Desker</h1>
		<p>
			Your all-in-one tabs manager, saver, and all of that synced to every
			devices
		</p>
	</div>

	<div class="video-presentation">
		<video
			src="/videos/presentation.mp4"
			controls={false}
			muted
			poster={DeskerBanner}
			autoplay
			loop
		></video>
	</div>
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
	<section id="functionnalities">
		<h2>Desker functionnalities</h2>
		<ol>
			<li>An all-in-one tab manager and saver</li>
			<li>Order your desks as your want</li>
			<li>Name them, re-name them and (re)color them</li>
			<li>Apply them to get back all your desk's tabs</li>
			<li>And all of that synced to every of your devices</li>
		</ol>
	</section>

	<div class="cta">
		<a href="/get"
			><button type="button"
				>Try desker now for free, <strong
					>and without any account creation</strong
				> !</button
			></a
		>
	</div>
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

		display: grid;
		grid-template-columns: 1fr 1fr;
		align-items: center;
		@media screen and (max-width: 710px) {
			grid-template-columns: unset;
			grid-template-rows: 30% 1fr;
			text-align: center;
		}

		padding: 0 25px;

		color: var(--color-white);
		gap: 15px;

		> .text {
			> h1 {
				font-size: 50px;
			}
		}

		> .video-presentation {
			height: 100%;
			display: grid;
			place-items: center;

			> video {
				aspect-ratio: 16 / 9;
				border-radius: 15px;
				max-height: 45vh;
				pointer-events: none;
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
		.cta {
			display: flex;
			align-items: center;
			justify-content: center;
		}
	}
</style>
