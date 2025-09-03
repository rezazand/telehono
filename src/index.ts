import { Hono } from "hono";
import { BotManager } from "./BotManager";
import type { Update as TelegramUpdate } from "typegram";

const app = new Hono<{ Bindings: CloudflareBindings }>();

let bot: BotManager;

app.use('*', (c, next) => {
  if (!bot) {
    bot = new BotManager(c.env.TELEGRAM_BOT_TOKEN);
    
    // Check have permissions
    bot.use(async (ctx, next) => {
      if (ctx.chatId !== Number(c.env.ADMIN)) {
        await ctx.reply(`You don't have access to this bot!`);
        return; // Don't call next(), stops execution
      }
      await next(); // Continue to next middleware/handler
    });

    // Setup bot handlers
    bot.start(async (ctx) => await ctx.reply(`${ctx.chatId} I'm started! check /help`));
    bot.help(async (ctx) => await ctx.reply('Send me a sticker'));
    bot.event('sticker', async (ctx) => await ctx.reply('👍'));
    bot.text('hi', async (ctx) => await ctx.reply('Hey there'));
    bot.command('command', async (ctx) => await ctx.reply('hello'));

  }
  
  return next();
});

app.get("/", (c) => c.text("Hello from Cloudflare Worker!"));

app.get("/registerWebhook", async (c) => {
  const url = new URL(c.req.url);
  const suffix = "/webhook";
  const secret = c.env.WEBHOOK_SECRET;
  const result = await bot.registerWebhook(url, suffix, secret);
  return result;
});

app.get("/unregisterWebhook", async (c) => {
  const result = await bot.registerWebhook();
  return result;
});

app.post("/webhook", async (c) => {
  const secretToken = c.req.header("X-Telegram-Bot-Api-Secret-Token");
  if (secretToken !== c.env.WEBHOOK_SECRET) {
    console.error("Unauthorized: Invalid secret token.");
    return c.text("Unauthorized", 401);
  }
  try {
    const update = await c.req.json<TelegramUpdate>();
    
    c.executionCtx.waitUntil(bot.processUpdate(update));
  } catch (error) {
    console.error("Error processing webhook:", error);
    return c.text("Internal Server Error", 500);
  }
  return c.json({ ok: true });
});

app.notFound((c) => {
  if (c.env.ASSETS) {
    return c.env.ASSETS.fetch(c.req.raw);
  }
  return c.text("Not Found", 404);
});

export default app;

