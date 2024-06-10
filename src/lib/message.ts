import type { Database } from "./types/supabase";
import type { Session } from "@supabase/supabase-js";
import BetterPostMessage from "better-postmessage";

export interface Message<Data = any> {
	id: string;
	data?: Data;
	error?: {
		title: string;
		description?: string;
	};
}
let proxy: BetterPostMessage<Message, Omit<Message, "id"> | void> | null = null;

export async function askFor<R>(
	id: string,
	data?: Message["data"],
	error?: Message["error"]
) {
	if (!proxy)
		proxy = new BetterPostMessage(window, {
			name: "Desker",
			debug: true,
			answerTimeout: 1000,
		});
	const message = proxy.post({
		id,
		data,
		error,
	});

	return await message.answer as Omit<Message<R>, "id">;
}

export type UserResponse = Session["user"] & Database["public"]["Tables"]["plans"]["Row"]
