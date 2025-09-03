import { Context } from "../context";

export const startHandler = async (ctx: Context) => {
  await ctx.reply(`I'm started! check /help`);
};
