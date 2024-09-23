import type { Database } from "./types/supabase";
import type {
  Session,
  UserAttributes,
  VerifyOtpParams,
} from "@supabase/supabase-js";
import BetterPostMessage from "better-postmessage";

export type DeskerUser = Session["user"] & {
  plan: Database["public"]["Tables"]["plans"]["Row"];
};
export type DeskerDesk = Database["public"]["Tables"]["desks"]["Row"];

interface ReqAnsValue<Request = never, Answer = never> {
  requestData: Request;
  answerData: Answer;
}
export interface RequestsAnswers {
  ping: ReqAnsValue<never, { pong: true }>;
  user: ReqAnsValue<never, { user: DeskerUser }>;
  token: ReqAnsValue<
    never,
    {
      token: string;
    }
  >;
  desks: ReqAnsValue<never, { desks: DeskerDesk[] }>;
  clearCache: ReqAnsValue<{
    user?: boolean;
    desks?: boolean;
  }>;
  logout: ReqAnsValue<{ global?: boolean }>;
  signin: ReqAnsValue<{
    email: string;
    password: string;
    force?: boolean;
  }>;
  signup: ReqAnsValue<{
    email: string;
    password: string;
    username?: string;
  }>;
  updateuser: ReqAnsValue<{
    data: UserAttributes;
  }>;
  deleteuser: ReqAnsValue;
  otp_signin: ReqAnsValue<VerifyOtpParams>;
}

export interface Message<
  KEY extends keyof RequestsAnswers = keyof RequestsAnswers,
  type extends "request" | "answer" = "request"
> {
  id: KEY;
  data?: RequestsAnswers[KEY][type extends "request"
    ? "requestData"
    : "answerData"];
  error?: {
    title: string;
    description?: string;
  };
}
let proxy: BetterPostMessage<Message, Omit<Message, "id"> | void> | null = null;

export async function askFor<ID extends Message["id"] = Message["id"]>(
  id: ID,
  data?: Message<ID, "request">["data"],
  error?: Message<ID>["error"]
) {
  if (!proxy)
    proxy = new BetterPostMessage(window, {
      tunnel: "Desker",
      debug: true,
      answerTimeout: 5_000,
    });
  const message = proxy.post(
    {
      id,
      data,
      error,
    },
    id === "ping" ? 150 : undefined
  );

  return (await message.answer) as Omit<Message<ID, "answer">, "id">;
}
