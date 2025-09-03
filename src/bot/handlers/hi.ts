import { Context } from "../context";

export const hiHandler = async (ctx: Context) => {
  await ctx.reply('Hey there');
};
