import { Hono } from "hono";
import { Bot } from "./bot";
import type { Update } from "typegram";
import { handlers, adminHandlers } from "./bot/config";
import { Context } from "./bot/context";
import { adminMiddleware } from "./bot/middleware/admin";

const app = new Hono<{ Bindings: CloudflareBindings }>();

let bot: Bot;

app.use('*', (c, next) => {
  if (!bot) {
    bot = new Bot(c.env.TELEGRAM_BOT_TOKEN);
  }
  return next();
});

app.post("/webhook", async (c) => {
  const secretToken = c.req.header("X-Telegram-Bot-Api-Secret-Token");
  if (secretToken !== c.env.WEBHOOK_SECRET) {
    console.error("Unauthorized: Invalid secret token.");
    return c.text("Unauthorized", 401);
  }
  
  try {
    const update: Update = await c.req.json();
    const ctx = new Context(update, bot.api);

    let allHandlers = [...handlers];
    
    // Add admin handlers if user is admin
    if (adminMiddleware(Number(c.env.ADMIN))(ctx)) {
        allHandlers = [...adminHandlers(), ...allHandlers];
    }

    c.executionCtx.waitUntil(bot.executeHandler(ctx, allHandlers));
  } catch (error) {
    console.error("Error processing webhook:", error);
    return c.text("Internal Server Error", 500);
  }
  return c.json({ ok: true });
});


app.get("/test", async (c) => {
  await bot.api.sendMessage(Number(c.env.ADMIN), "Test endpoint");
  return c.text('ok');
});

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

app.notFound((c) => {
  if (c.env.ASSETS) {
    return c.env.ASSETS.fetch(c.req.raw);
  }
  return c.text("Not Found", 404);
});

export default app;

