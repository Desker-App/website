<script lang="ts" context="module">
  let force_update = writable(0);
  const updatePage = () => force_update.set(get(force_update) + 1);

  /**
   * Update the page and the desker user token link
   * @param force Set to true this parameter if the token has not changed and you want to reload the page anyway
   */
  export async function updateAuth(force = false): Promise<void> {
    await updateLink().then((require_update) => {
      if (typeof require_update === "boolean") {
        console.log("SESSION COOKIE HAS BEEN EDITED", require_update);

        if (require_update) toast.success("Your account has been (re)linked!");
        else toast.error("Your account has been unlinked.");
        return invalidateAll().then(() => updatePage());
      } else if (force) invalidateAll().then(() => updatePage());
    });
  }

  export const loading = writable(false);

  export interface toastParam {
    method: "error" | "success";
    message: string;
  }
</script>

<script lang="ts">
  import "$lib/assets/scss/app.scss";
  import Header from "$lib/components/Header.svelte";
  import toast, { Toaster } from "svelte-french-toast";
  import { onNavigate, beforeNavigate, afterNavigate } from "$app/navigation";
  import { get, writable } from "svelte/store";
  import { invalidateAll } from "$app/navigation";
  import { updateLink } from "$lib/linker";
  import type { LayoutData } from "./$types";
  import Footer from "$lib/components/Footer.svelte";
  import { type TransitionConfig } from "svelte/transition";
  import { expoInOut } from "svelte/easing";
  import queryHandler from "$lib/queryHandler";
  import { askFor } from "$lib/message";

  export let data: LayoutData;
  afterNavigate(() => {
    queryHandler();
  });

  function loader_transition(e: HTMLElement): TransitionConfig {
    e.style.transformOrigin = "top center";
    return {
      css(t, u) {
        return `
					scale: 1 ${t};
				`;
      },
      easing: expoInOut,
      duration: 150,
    };
  }

  beforeNavigate(() => {
    $loading = true;
  });
  onNavigate((navigation) => {
    navigation.complete.finally(() => ($loading = false));
  });

  globalThis.askFor = askFor;
</script>

<Toaster position="top-right" />

{#if $loading}
  <div id="loader" transition:loader_transition></div>
{/if}

{#key $force_update}
  <Header user={data.user} />
  <slot />
{/key}

<Footer />

<style lang="scss">
  #loader {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 10px;

    &::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;

      $bg-one-step: 750px;
      background-image: linear-gradient(
        to right,
        transparent,
        var(--color-primary),
        var(--color-secondary),
        transparent
      );
      background-repeat: repeat-x;
      background-size: $bg-one-step 100%;

      @keyframes anim {
        from {
          background-position: 0 0;
        }
        to {
          background-position: $bg-one-step 0;
        }
      }
      animation: anim 2.5s linear infinite;
    }
  }
</style>
