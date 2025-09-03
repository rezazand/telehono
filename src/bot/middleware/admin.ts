import { Context } from "../context";

export const adminMiddleware = (adminId: number) => {
  return (ctx: Context): boolean => {
    if (ctx.chatId === adminId) {
      return true;
    }
    return false;
  };
};

export const requireAdmin = (adminId: number) => {
  return async (ctx: Context, next: () => Promise<void>) => {
    if (adminMiddleware(adminId)(ctx)) {
      await next();
    } else {
      await ctx.reply("❌ Access denied. This command is admin-only.");
    }
  };
};
