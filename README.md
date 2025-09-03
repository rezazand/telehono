# Hobo Bot 🤖

A lightweight, type-safe Telegram bot built on **Cloudflare Workers** using **Hono** framework. This bot provides a clean, middleware-based architecture for handling Telegram updates with webhook support.

## ✨ Features

- **Serverless**: Built on Cloudflare Workers for global edge deployment
- **Type-Safe**: Full TypeScript support with proper type definitions
- **Middleware System**: Clean, composable middleware architecture
- **Webhook Support**: Secure webhook handling with secret token validation
- **Permission Control**: Built-in admin-only access control
- **Event Handling**: Support for commands, text messages, and Telegram events (stickers, etc.)
- **Static Assets**: Serves static files from the `public` directory

## 🏗️ Architecture

### Core Components

- **`BotManager`**: The main bot orchestrator handling middleware and event routing
- **`Context`**: Telegram update context with convenient helper methods
- **`TelegramApi`**: Complete Telegram Bot API wrapper with type definitions
- **`index.ts`**: Hono application with webhook endpoints and bot initialization

### Dependencies

- **`hono`**: Fast, lightweight web framework for Cloudflare Workers
- **`typegram`**: Complete TypeScript type definitions for Telegram Bot API

> **Note**: This project uses `typegram` directly instead of `telegraf` for optimal bundle size, as we only need the type definitions without the full Telegraf library functionality.

### Request Flow

```
Telegram → Webhook → Cloudflare Worker → BotManager → Middleware Chain → Event Handlers
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Cloudflare account
- Telegram Bot Token (from [@BotFather](https://t.me/botfather))

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Deployment

```bash
npm run deploy
```

### Type Generation

Generate TypeScript types for your Worker configuration:

```bash
npm run cf-typegen
```

## ⚙️ Configuration

### Environment Variables

Set these in your Cloudflare Worker dashboard or via `wrangler.toml`:

- `TELEGRAM_BOT_TOKEN`: Your Telegram bot token from BotFather
- `ADMIN`: Admin chat ID (only this user can interact with the bot)
- `WEBHOOK_SECRET`: Secret token for webhook validation

### Webhook Setup

1. **Register webhook**: Visit `https://your-worker.your-subdomain.workers.dev/registerWebhook`
2. **Unregister webhook**: Visit `https://your-worker.your-subdomain.workers.dev/unregisterWebhook`

## 📝 Usage Examples

### Basic Bot Setup

```typescript
import { BotManager } from "./BotManager";
import type { Update } from "typegram";

const bot = new BotManager(TELEGRAM_BOT_TOKEN);

// Middleware for access control
bot.use(async (ctx, next) => {
  if (ctx.chatId !== ADMIN_ID) {
    await ctx.reply("You don't have access to this bot!");
    return;
  }
  await next();
});

// Command handlers
bot.start(async (ctx) => await ctx.reply("I'm started! check /help"));
bot.help(async (ctx) => await ctx.reply('Send me a sticker'));
bot.command('oldschool', async (ctx) => await ctx.reply('hello'));

// Text handlers
bot.text('hi', async (ctx) => await ctx.reply('Hey there'));

// Event handlers
bot.event('sticker', async (ctx) => await ctx.reply('👍'));
```

### Middleware System

The bot uses a clean middleware-based architecture for cross-cutting concerns:

```typescript
// Permission middleware
bot.use(async (ctx, next) => { 
  if (ctx.chatId !== AUTHORIZED_USER_ID) {
    await ctx.reply(`You don't have access to this bot!`);
    return; // Stop execution
  }
  await next(); // Continue to next middleware/handler
});

// Logging middleware
bot.use(async (ctx, next) => {
  console.log(`Received update from chat ${ctx.chatId}`);
  await next();
});

// Rate limiting middleware
bot.use(async (ctx, next) => {
  // Add rate limiting logic here
  await next();
});
```

**Key Features:**
- Middlewares execute in the order they're added
- Use `await next()` to continue or `return` to stop execution
- Full async/await support
- Composable and reusable across different bots

### Available Handler Types

The BotManager provides a clean, simplified API with improved method naming:

#### Commands
```typescript
// Primary method
bot.command('start', async (ctx) => await ctx.reply("I'm started!"));
bot.command('help', async (ctx) => await ctx.reply('Send me a sticker'));
bot.command('custom', async (ctx) => await ctx.reply('Custom command'));

// Convenience shortcuts
bot.start(async (ctx) => await ctx.reply("I'm started!")); // Same as command('start')
bot.help(async (ctx) => await ctx.reply('Help text'));     // Same as command('help')
```

#### Text Messages
```typescript
// Primary method
bot.text('hi', async (ctx) => await ctx.reply('Hey there'));
bot.text('hello', async (ctx) => await ctx.reply('Hi!'));

// Legacy alias (backward compatibility)
bot.hears('hi', async (ctx) => await ctx.reply('Hey there')); // Same as text('hi')
```

#### Events
```typescript
// Primary method
bot.event('sticker', async (ctx) => await ctx.reply('👍'));
bot.event('photo', async (ctx) => await ctx.reply('Nice photo!'));

// Legacy alias (backward compatibility)  
bot.on('sticker', async (ctx) => await ctx.reply('👍')); // Same as event('sticker')
```

#### Method Summary
- **`bot.use(middleware)`**: Add middleware for cross-cutting concerns
- **`bot.start(handler)`**: Handle `/start` command
- **`bot.help(handler)`**: Handle `/help` command  
- **`bot.command(name, handler)`**: Handle custom commands
- **`bot.text(text, handler)`**: Handle specific text messages
- **`bot.event(type, handler)`**: Handle Telegram events (sticker, photo, etc.)

### Context API

The `Context` object provides convenient methods:

```typescript
bot.text('hello', async (ctx) => {
  // Access update data
  console.log(ctx.update);
  console.log(ctx.message);
  console.log(ctx.chatId);
  
  // Reply to the message
  await ctx.reply('Hello back!');
  
  // Use Telegram API directly
  await ctx.api.sendMessage(ctx.chatId, 'Direct API call');
});
```

## 🛠️ API Reference

### BotManager Methods

| Method | Description | Notes |
|--------|-------------|-------|
| `use(middleware)` | Add middleware function | Executes in order, use `await next()` to continue |
| `start(handler)` | Handle `/start` command | Shortcut for `command('start', handler)` |
| `help(handler)` | Handle `/help` command | Shortcut for `command('help', handler)` |
| `command(name, handler)` | Handle custom command | Primary method for commands |
| `text(text, handler)` | Handle specific text | Primary method for text matching |
| `event(type, handler)` | Handle Telegram events | Primary method for events (sticker, photo, etc.) |
| `hears(text, handler)` | Handle specific text | Legacy alias for `text()` |
| `on(type, handler)` | Handle Telegram events | Legacy alias for `event()` |
| `registerWebhook(url, suffix, secret)` | Register webhook with Telegram | For webhook setup |
| `processUpdate(update)` | Process incoming Telegram update | Internal processing method |

### Architecture Improvements

The BotManager has been refactored for simplicity and better maintainability:

#### Key Improvements
- **Simpler Internal Structure**: Separate arrays for different handler types instead of complex nested objects
- **Better Method Names**: `text()` instead of `hears()`, `event()` instead of `on()` - more descriptive
- **Cleaner Middleware Execution**: Recursive middleware chain with predictable execution flow
- **Better Type Safety**: Simple, consistent TypeScript types
- **Backward Compatibility**: Legacy methods (`on()`, `hears()`) still work as aliases

#### Migration from Legacy API
```typescript
// ❌ Old approach (complex)
let permission = 1;
bot.on('*', (ctx) => { 
  if (ctx.chatId != AUTHORIZED_USER_ID) {
    ctx.reply(`You don't have access to this bot!`);
    permission = 0;
  }
});
if (permission) {
  // setup handlers...
}

// ✅ New approach (clean middleware)
bot.use(async (ctx, next) => { 
  if (ctx.chatId !== AUTHORIZED_USER_ID) {
    await ctx.reply(`You don't have access to this bot!`);
    return; // Stops execution
  }
  await next(); // Continues to handlers
});

// Setup handlers normally
bot.start(async (ctx) => await ctx.reply("I'm started!"));
bot.event('sticker', async (ctx) => await ctx.reply('👍'));
```

### Context Properties

| Property | Type | Description |
|----------|------|-------------|
| `update` | `Update` | Full Telegram update object |
| `message` | `Message` | Extracted message from update |
| `chatId` | `number` | Chat ID for current update |
| `api` | `TelegramApi` | Telegram API instance |

## 📁 Project Structure

```
hobo-bot/
├── src/
│   ├── index.ts          # Main Hono application
│   ├── BotManager.ts     # Bot orchestrator with middleware
│   ├── Context.ts        # Update context wrapper
│   └── TelegramApi.ts    # Complete Telegram API wrapper
├── public/
│   └── index.html        # Static assets
├── package.json          # Dependencies and scripts
├── tsconfig.json         # TypeScript configuration
├── wrangler.jsonc        # Cloudflare Worker configuration
└── README.md            # This file
```

## 🔒 Security Features

- **Webhook Secret Validation**: All webhook requests are validated with a secret token
- **Admin-Only Access**: Built-in middleware restricts bot access to authorized users
- **Type Safety**: Full TypeScript coverage prevents runtime errors

## 🌐 Endpoints

- **`GET /`**: Health check endpoint
- **`GET /registerWebhook`**: Register webhook with Telegram
- **`GET /unregisterWebhook`**: Remove webhook from Telegram  
- **`POST /webhook`**: Handle incoming Telegram updates
- **Static files**: Served from `/public` directory

## 🚀 Deployment

The bot is designed for Cloudflare Workers and includes:

- **Edge deployment**: Global distribution for low latency
- **Auto-scaling**: Handles traffic spikes automatically
- **Static assets**: Serves files from the `public` directory
- **Environment management**: Secure secret management

## 📖 Learn More

- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)
- [Hono Framework](https://hono.dev/)
- [Telegram Bot API](https://core.telegram.org/bots/api)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
