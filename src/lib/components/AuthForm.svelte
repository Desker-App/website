<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import { askFor, type DeskerUser } from "$lib/message";
  import toast from "svelte-french-toast";
  import Form from "./Form.svelte";
  import { updateAuth } from "../../routes/+layout.svelte";
  import { onMount } from "svelte";

  export let user: DeskerUser | undefined = undefined;
  $: state = ($page.state.currentParams?.["connect"] !== undefined ? "connect" : "create") as
    | "create"
    | "connect";

  const _default_redirect = "/manage";
  export let redirect = _default_redirect;

  let showMailboxCheckMessage = user?.email && !user.confirmed_at;
  async function formSubmited(data: FormData) {
    const email = data.get("email")?.toString();
    const password = data.get("password")?.toString();
    const username = data.get("username")?.toString();

    if (state === "create") {
      if (!(email && password))
        return toast.error("Please provide at least an email and a password !");

      const promise = new Promise<string>(async (res, rej) => {
        const { error } = await askFor("signup", {
          email,
          password,
          username,
        }).catch(() => ({
          error: {
            title: "Extension didn't answered.",
            description: "Try to check your internet connection ?",
          },
        }));
        if (error) rej(`[${error.title}]> ${error.description}`);
        else {
          showMailboxCheckMessage = true;
          res("Please check your mailbox to finalize your account creation.");
        }
      });

      toast.promise(promise, {
        loading: "Creating your account...",
        success: (v) => v,
        error: (v) => v,
      });
    } else {
      if (!(email && password))
        return toast.error("Please provide your email address and password.");

      const promise = new Promise<string>(async (res, rej) => {
        const { error } = await askFor("signin", {
          email,
          password,
        }).catch(() => ({
          error: {
            title: "Extension doesn't answered.",
            description: "Try to check your internet connection ?",
          },
        }));
        if (error) rej(`[${error.title}]> ${error.description}`);
        else
          updateAuth().then(() => {
            goto(redirect);
          });
        res("Congratulation ! You're now connected !");
      });

      toast.promise(promise, {
        loading: "Connecting to your account...",
        success: (v) => v,
        error: (v) => v,
      });
    }
  }

  onMount(() => {
    if (state !== "create" && state !== "connect") {
      if (state) $page.url.searchParams.delete(state);
      goto(`?create&${$page.url.searchParams.toString()}`);
    }

    if (user && !user.is_anonymous && redirect !== _default_redirect)
      goto(redirect);
  });
</script>

<Form onSubmit={formSubmited}>
  <div class="form-inner">
    {#if showMailboxCheckMessage}
      <h2>Check your mailbox !</h2>
      <p>
        Your account has been created. But you need to confirm your email
        address.
      </p>

      <p>
        <i>Please be sure to activate your account on this browser !</i>
      </p>
    {:else if user && !user.is_anonymous}
      <h2>Already connected !</h2>
      <p>You're already connected to your account.</p>
      <p>
        If you want to connect to another account, please go to your <a
          href="/manage">account manager</a
        > and logout !
      </p>
    {:else if state === "create"}
      <h2>Create your account</h2>

      <label for="username">
        Username
        <input
          type="text"
          name="username"
          id="username"
          autocomplete="username"
          placeholder="Choose an username (you can change it later)"
        />
      </label>
      <label for="email">
        Email address
        <input
          type="email"
          name="email"
          id="email"
          placeholder="exemple@domain.com"
          autocomplete="email"
          required
        />
      </label>
      <label for="password">
        Password
        <input
          type="password"
          name="password"
          id="password"
          autocomplete="new-password"
          placeholder="Create your password"
          required
        />
      </label>

      <button type="submit">Create and link</button>
      <a href="?connect">Already have an account ?</a>
    {:else if state === "connect"}
      <h2>Connect to an existing account</h2>

      {#await askFor("desks") then { data }}
        {#if data?.desks.length}
          <div class="warning">
            <h3>Be aware !</h3>
            <p>
              Notice that you've desks saved in your extension, and they will be
              destroyed after you've login to your account.
            </p>
            <p>To avoid this, we recommend you to create a new account.</p>
          </div>
        {/if}
      {/await}

      <label for="email">
        Email address
        <input
          type="email"
          name="email"
          id="email"
          autocomplete="email"
          placeholder="exemple@domain.com"
          required
        />
      </label>
      <label for="password">
        Password
        <input
          type="password"
          name="password"
          id="password"
          autocomplete="current-password"
          placeholder="Enter your password"
          required
        />
      </label>

      <button type="submit">Connect and link</button>
      <a href="/reset-psw">Forgot your password ?</a>
      <a href="?create">Don't have an account ?</a>
    {/if}
  </div>
</Form>

<style lang="scss">
  .form-inner {
    max-width: 750px;
    margin: 0 auto;
    padding: 15px;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;

    gap: 15px;

    > .warning {
      padding: 10px 15px;
      background-color: var(--color-primary);
      border-radius: 5px;
      font-size: 12.5px;
      width: 100%;
      > h3 {
        font-size: 25px;
      }
    }

    > h2 {
      margin-bottom: 20px;
    }

    > button {
      width: 100%;
    }
    > a {
      display: inline-block;
      margin: 0 auto;
    }
    > label {
      display: flex;
      align-items: center;
      justify-content: stretch;
      gap: 25px;
      width: 100%;

      > input {
        flex-grow: 1;
      }
    }
  }
</style>
