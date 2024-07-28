import { browser } from "$app/environment";
import { askFor } from "./message";
import { redirect, type Cookies as SvelteCookies } from "@sveltejs/kit";
import Cookies from "js-cookie";

export const USER_ID_COOKIE_NAME = "__desker_user_id";
export function unlink() {
	if (!browser) throw new Error("Cannot evaluate script in server side.");
	Cookies.remove(USER_ID_COOKIE_NAME);
}
/**
 * @returns True if the cookie has been edited, False if the cookie has been deleted, undefined else
 */
export async function updateLink(): Promise<boolean | undefined> {
	if (!browser) throw new Error("Cannot evaluate script in server side.");
	const currentUserID = Cookies.get(USER_ID_COOKIE_NAME);

	const answer = await askFor("ping").catch(() => {
		unlink();
	});
	if (!answer) return currentUserID ? false : undefined;

	const { data } = await askFor("user").catch(() => {
		unlink();
		return {
			data: undefined,
		};
	});

	if (data?.user?.id === currentUserID) return;

	if (data?.user) {
		Cookies.set(USER_ID_COOKIE_NAME, data.user.id, {
			sameSite: "Lax",
		});
		// ? Returning true only if the user is a real user, else we act like an unconnected user
		return !data.user.is_anonymous;
	}

	unlink();
	return false;
}

/**
 * !! Use this function in server-side only
 */
export function getUserIdFromCookies<
	A extends boolean = false,
	R = A extends true ? string | null : string | never
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
	const user_id = cookies.get(USER_ID_COOKIE_NAME);
	if (!user_id) {
		if (allow_null) return null as R;

		throw redirect(
			307,
			`/link?redirect=${url.href}&toast=${JSON.stringify({
				method: "error",
				message:
					"You need to link your account to access to this page.",
			})}`
		);
	}

	return user_id as R;
}
