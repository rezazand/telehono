import { Context } from "./context";

export type HandlerType = "command" | "text" | "event" ;

export interface Handler {
  type: HandlerType;
  trigger?: string;
  handler: (ctx: Context) => Promise<void> | void;
}
