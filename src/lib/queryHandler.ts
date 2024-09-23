import { browser } from "$app/environment";
import { goto, replaceState } from "$app/navigation";
import toast from "svelte-french-toast";
import { updateAuth, type toastParam } from "../routes/+layout.svelte";
import { askFor } from "./message";
import type {
  EmailOtpType,
  VerifyEmailOtpParams,
  VerifyOtpParams,
} from "@supabase/supabase-js";

/**
 * Handles all the possible query parameters
 * Must be executed in client-side context.
 */
export default async function queryHandler() {
  if (!browser)
    throw new Error("Cannot use this function in a server-side context.");

  const searchParams = new URLSearchParams(location.search);

  if (searchParams.has("update")) {
    await askFor("clearCache", {
      user: true,
      desks: true,
    });
    updateAuth(true);
  } else updateAuth();

  if (searchParams.has("toast")) {
    try {
      const { method, message }: toastParam = JSON.parse(
        searchParams.get("toast")!
      );

      switch (method) {
        case "error":
          toast.error(message);
          break;
        case "success":
          toast.success(message);
          break;
        default:
          break;
      }
    } catch (err) {}
  }

  if (location.hash) {
    const parameters = new URLSearchParams(location.hash.slice(1));
    console.log(
      "Detected parameters:",
      Object.fromEntries(parameters.entries()),
      {
        type: "email_change",
        token_hash: parameters.get("access_token") || "",
      }
    );

    if (parameters.get("error"))
      toast.error(
        `[${parameters.get("error")}]> ${parameters.get("error_description")}`
      );
    else {
      const type = parameters.get("type") as VerifyOtpParams["type"] | null;
      switch (type) {
        case "email_change": {
          await askFor("clearCache", {
            user: true,
          });

          await updateAuth(true);
          goto("/manage");
          toast.success(
            "Your account has been correctly linked to your new email address !"
          );
          break;
        }

        default:
          console.error("OTP detected but not currently supported.");
          toast.error("The request has not been processed.");
          break;
      }
    }
  }
  replaceState(location.pathname, {
    currentParams: Object.fromEntries(searchParams.entries()),
  });
}
