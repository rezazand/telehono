import { Context } from "../context";

export interface Logger {
  error(message: string, error?: Error): void;
  warn(message: string): void;
  info(message: string): void;
  debug(message: string): void;
}

export class ConsoleLogger implements Logger {
  error(message: string, error?: Error): void {
    console.error(`[ERROR] ${message}`, error);
  }

  warn(message: string): void {
    console.warn(`[WARN] ${message}`);
  }

  info(message: string): void {
    console.info(`[INFO] ${message}`);
  }

  debug(message: string): void {
    console.debug(`[DEBUG] ${message}`);
  }
}

export const errorHandler = (logger: Logger = new ConsoleLogger()) => {
  return async (ctx: Context, handler: (ctx: Context) => Promise<void>) => {
    try {
      await handler(ctx);
    } catch (error) {
      logger.error(`Error handling update for chat ${ctx.chatId}:`, error as Error);
      
      try {
        await ctx.reply("❌ Sorry, something went wrong. Please try again later.");
      } catch (replyError) {
        logger.error("Failed to send error message to user:", replyError as Error);
      }
    }
  };
};
