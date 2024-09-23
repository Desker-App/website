<script lang="ts">
  import { page } from "$app/stores";
  import AuthForm from "$lib/components/AuthForm.svelte";
  import type { PageData } from "../$types";

  export let data: PageData;
  let redirect: string | undefined = $page.state.currentParams?.["redirect"] || undefined;
</script>

<svelte:head>
  <title>Link your account - Desker</title>
</svelte:head>

<AuthForm user={data?.user} {redirect} />
