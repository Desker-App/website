import { browser } from "$app/environment";
import { askFor } from "./message";
import { redirect, type Cookies as SvelteCookies } from "@sveltejs/kit";
import Cookies from "js-cookie";
import type { toastParam } from "../routes/+layout.svelte";

export const USER_TOKEN_COOKIE = "__desker_user_token";
export function unlink() {
	if (!browser) throw new Error("Cannot evaluate script in server side.");
	Cookies.remove(USER_TOKEN_COOKIE);
}
/**
 * @returns True if the cookie has been edited, False if the cookie has been deleted, undefined else
 */
export async function updateLink(): Promise<boolean | undefined> {
	if (!browser) throw new Error("Cannot evaluate script in server side.");
	const currentToken = Cookies.get(USER_TOKEN_COOKIE);

	const answer = await askFor("ping").catch(() => {
		unlink();
	});
	if (!answer) return currentToken ? false : undefined;

	const { data } = await askFor("token").catch(() => {
		unlink();
		return {
			data: undefined,
		};
	});

	if (currentToken === data?.token) return;

	if (data?.token) {
		Cookies.set(USER_TOKEN_COOKIE, data.token, {
			sameSite: "Lax",
		});
	}

	// ? Returning true only if the user is a real user, else we act like an unconnected user
	const is_connected = await askFor("user").then(
		({ data }) => !data?.user.is_anonymous
	);
	if (!is_connected) {
		unlink();
		return currentToken ? false : undefined;
	}
	return is_connected;
}

/**
 * !! Use this function in server-side only
 */
export function getUserTokenFromCookies<
	A extends boolean = false,
	R = A extends true ? string | null : string
>(
	event: {
		cookies: SvelteCookies;
		url: URL;
	},
	allow_null?: A
): R {
	if (browser)
		throw new Error("This function must be executed in server-side only.");
	const { cookies, url } = event;
	const user_token = cookies.get(USER_TOKEN_COOKIE);
	if (!user_token) {
		if (allow_null) return null as R;

		throw redirect(
			307,
			`/link?redirect=${url.href}&toast=${JSON.stringify({
				method: "error",
				message:
					"You need to link your account to access to this page.",
			} satisfies toastParam)}`
		);
	}

	return user_token as R;
}
