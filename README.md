# Hono Telegram Bot 🤖

A lightweight, type-safe Telegram bot built on **Cloudflare Workers** using **Hono** framework. This bot features a clean, modular architecture with comprehensive error handling, input validation, and flexible handler management.

## ✨ Features

- **Serverless**: Built on Cloudflare Workers for global edge deployment
- **Type-Safe**: Full TypeScript support with proper type definitions
- **Modular Architecture**: Clean separation of concerns with organized folder structure
- **Webhook Support**: Secure webhook handling with secret token validation
- **Admin Controls**: Built-in admin-only access control with middleware
- **Event Handling**: Support for commands, text messages, and Telegram events (stickers, etc.)
- **Error Handling**: Comprehensive error management with graceful recovery
- **Input Validation**: Built-in validation utilities for secure command processing
- **Static Assets**: Serves static files from the `public` directory

## 🏗️ Architecture

### Core Components

- **`Bot`**: The main bot class handling update processing and handler execution
- **`Context`**: Enhanced Telegram update context with convenient helper methods
- **`TelegramApi`**: Complete Telegram Bot API wrapper with comprehensive type definitions
- **`Handler`**: Type-safe handler definitions for commands, text, and events
- **Middleware**: Error handling and admin access control middleware
- **Handlers**: Modular command and event handlers (start, help, echo, etc.)
- **Validation**: Input validation utilities for secure command processing

### Project Structure

```
src/
├── index.ts                 # Main Hono application
├── bot/
│   ├── index.ts            # Bot class - main orchestrator
│   ├── context.ts          # Enhanced Context with helper methods
│   ├── config.ts           # Handler configuration and registration
│   ├── types.ts            # Type definitions for handlers
│   ├── handlers/           # Modular command and event handlers
│   │   ├── start.ts        # /start command handler
│   │   ├── help.ts         # /help command handler
│   │   ├── echo.ts         # /echo command with validation
│   │   ├── hi.ts           # "hi" text handler
│   │   ├── sticker.ts      # Sticker event handler
│   │   ├── info.ts         # Admin-only info command
│   │   └── stats.ts        # Admin-only stats command
│   ├── middleware/         # Middleware for cross-cutting concerns
│   │   ├── admin.ts        # Admin access control
│   │   └── error.ts        # Error handling and logging
│   ├── telegram/           # Telegram API integration
│   │   ├── api.ts          # Complete API wrapper
│   │   └── types.ts        # Telegram-specific types
│   └── utils/              # Utility functions
│       └── validation.ts   # Input validation helpers
```

### Dependencies

- **`hono`**: Fast, lightweight web framework for Cloudflare Workers
- **`typegram`**: Complete TypeScript type definitions for Telegram Bot API

> **Note**: This project uses `typegram` directly instead of `telegraf` for optimal bundle size, as we only need the type definitions without the full Telegraf library functionality.

### Request Flow

```
Telegram → Webhook → Cloudflare Worker → Bot → Handler Execution → Response
                                          ↓
                               Admin Middleware Check
                                          ↓
                               Error Handling Wrapper
                                          ↓
                          Command/Text/Event Handler Selection
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

The new modular architecture provides a clean, configuration-based approach:

```typescript
import { Bot } from "./bot";
import { handlers, adminHandlers } from "./bot/config";
import { Context } from "./bot/context";
import { adminMiddleware } from "./bot/middleware/admin";

const bot = new Bot(TELEGRAM_BOT_TOKEN);

// Process update with handlers
const ctx = new Context(update, bot.api);
let allHandlers = [...handlers];

// Add admin handlers if user is admin
if (adminMiddleware(ADMIN_ID)(ctx)) {
    allHandlers = [...adminHandlers(), ...allHandlers];
}

await bot.executeHandler(ctx, allHandlers);
```

### Handler Configuration

Handlers are now configured in a centralized location:

```typescript
// src/bot/config.ts
export const handlers: Handler[] = [
  { type: "command", trigger: "start", handler: startHandler },
  { type: "command", trigger: "help", handler: helpHandler },
  { type: "command", trigger: "echo", handler: echoHandler },
  { type: "text", trigger: "hi", handler: hiHandler },
  { type: "event", trigger: "sticker", handler: stickerHandler },
];

export const adminHandlers = (): Handler[] => [
  { type: 'command', trigger: 'info', handler: infoHandler },
  { type: 'command', trigger: 'stats', handler: statsHandler }
];
```

### Creating Custom Handlers

```typescript
// src/bot/handlers/custom.ts
import { Context } from "../context";
import { InputValidator } from "../utils/validation";

export const customHandler = async (ctx: Context) => {
  // Input validation
  const validation = InputValidator.validateCommand(ctx, 1);
  if (!validation.isValid) {
    await ctx.reply('Usage: /custom <your input>');
    return;
  }

  const text = InputValidator.getCommandText(ctx);
  
  // Enhanced context methods
  if (ctx.isPrivateChat) {
    await ctx.replyWithMarkdown(`*Private chat response:* ${text}`);
  } else {
    await ctx.reply(`Group response: ${text}`);
  }
};
```

### Middleware System

The bot includes powerful middleware for cross-cutting concerns:

```typescript
// Admin access control
import { adminMiddleware, requireAdmin } from "./bot/middleware/admin";

// Check if user is admin
if (adminMiddleware(ADMIN_ID)(ctx)) {
  // User has admin access
}

// Error handling with logging
import { errorHandler, Logger, ConsoleLogger } from "./bot/middleware/error";

const logger = new ConsoleLogger();
const withErrorHandling = errorHandler(logger);

await withErrorHandling(ctx, async (ctx) => {
  // Your handler logic here
  await someHandler(ctx);
});
```

### Input Validation

Built-in validation utilities ensure secure command processing:

```typescript
import { InputValidator } from "./bot/utils/validation";

export const echoHandler = async (ctx: Context) => {
  // Validate command has required arguments
  const validation = InputValidator.validateCommand(ctx, 1);
  if (!validation.isValid) {
    await ctx.reply('Please provide text to echo. Usage: /echo <your message>');
    return;
  }

  // Get and validate text length
  const text = InputValidator.getCommandText(ctx);
  const lengthValidation = InputValidator.validateTextLength(text, 1000);
  
  if (!lengthValidation.isValid) {
    await ctx.reply(lengthValidation.error!);
    return;
  }

  await ctx.reply(`You said: ${text}`);
};
```

### Enhanced Context API

The `Context` class provides powerful helper methods:

```typescript
export const handler = async (ctx: Context) => {
  // Access update data
  console.log(ctx.update);
  console.log(ctx.message);
  console.log(ctx.chatId);
  console.log(ctx.user);
  
  // Chat type detection
  if (ctx.isPrivateChat) {
    await ctx.reply('This is a private chat');
  } else if (ctx.isGroupChat) {
    await ctx.reply('This is a group chat');
  }
  
  // Different response formats
  await ctx.reply('Plain text response');
  await ctx.replyWithMarkdown('*Bold* text with _italics_');
  await ctx.replyWithHTML('<b>Bold</b> text with <i>italics</i>');
  
  // Direct API access
  await ctx.api.sendMessage(ctx.chatId!, 'Direct API call');
};
```

### Handler Types

The new architecture supports three types of handlers:

```typescript
// Command handlers (start with /)
{ type: "command", trigger: "start", handler: startHandler }
{ type: "command", trigger: "help", handler: helpHandler }
{ type: "command", trigger: "echo", handler: echoHandler }

// Text message handlers (exact match)
{ type: "text", trigger: "hi", handler: hiHandler }
{ type: "text", trigger: "hello", handler: helloHandler }

// Event handlers (Telegram events)
{ type: "event", trigger: "sticker", handler: stickerHandler }
{ type: "event", trigger: "photo", handler: photoHandler }
```

## 🛠️ API Reference

### Bot Class Methods

| Method | Description | Parameters |
|--------|-------------|------------|
| `constructor(token, logger?)` | Create bot instance | `token: string`, `logger?: Logger` |
| `executeHandler(ctx, handlers)` | Execute handler for update | `ctx: Context`, `handlers: Handler[]` |
| `registerWebhook(url?, suffix?, secret?)` | Register webhook with Telegram | Optional URL, suffix, and secret |

### Handler Interface

```typescript
interface Handler {
  type: HandlerType;           // "command" | "text" | "event"
  trigger?: string;            // Command name, text, or event type
  handler: (ctx: Context) => Promise<void> | void;
}
```

### Context Properties & Methods

| Property/Method | Type | Description |
|-----------------|------|-------------|
| `update` | `Update` | Full Telegram update object |
| `message` | `Message` | Extracted message from update |
| `chatId` | `number` | Chat ID for current update |
| `user` | `User` | Message sender information |
| `api` | `TelegramApi` | Telegram API instance |
| `isPrivateChat` | `boolean` | Check if chat is private |
| `isGroupChat` | `boolean` | Check if chat is group/supergroup |
| `reply(text, extra?)` | `Promise<void>` | Send reply message |
| `replyWithMarkdown(text, extra?)` | `Promise<void>` | Send reply with Markdown |
| `replyWithHTML(text, extra?)` | `Promise<void>` | Send reply with HTML |

### Middleware Functions

| Function | Description | Parameters |
|----------|-------------|------------|
| `adminMiddleware(adminId)` | Check admin privileges | `adminId: number` |
| `requireAdmin(adminId)` | Admin-only middleware wrapper | `adminId: number` |
| `errorHandler(logger?)` | Error handling wrapper | `logger?: Logger` |

### Validation Utilities

| Method | Description | Returns |
|--------|-------------|---------|
| `validateCommand(ctx, minArgs)` | Validate command arguments | `ValidationResult` |
| `validateTextLength(text, maxLength)` | Validate text length | `ValidationResult` |
| `getCommandText(ctx)` | Extract command arguments | `string` |

## 📁 Project Structure

```
hono-telegram-bot/
├── src/
│   ├── index.ts                    # Main Hono application
│   └── bot/
│       ├── index.ts               # Bot class - main orchestrator
│       ├── context.ts             # Enhanced Context with helper methods
│       ├── config.ts              # Handler configuration and registration
│       ├── types.ts               # Type definitions for handlers
│       ├── handlers/              # Modular command and event handlers
│       │   ├── start.ts           # /start command handler
│       │   ├── help.ts            # /help command handler
│       │   ├── echo.ts            # /echo command with validation
│       │   ├── hi.ts              # "hi" text handler
│       │   ├── sticker.ts         # Sticker event handler
│       │   ├── info.ts            # Admin-only info command
│       │   └── stats.ts           # Admin-only stats command
│       ├── middleware/            # Middleware for cross-cutting concerns
│       │   ├── admin.ts           # Admin access control
│       │   └── error.ts           # Error handling and logging
│       ├── telegram/              # Telegram API integration
│       │   ├── api.ts             # Complete API wrapper
│       │   └── types.ts           # Telegram-specific types
│       └── utils/                 # Utility functions
│           └── validation.ts      # Input validation helpers
├── public/
│   └── index.html                 # Static assets
├── package.json                   # Dependencies and scripts
├── tsconfig.json                  # TypeScript configuration
├── wrangler.jsonc                 # Cloudflare Worker configuration
└── README.md                      # This file
```

## 🔒 Security Features

- **Webhook Secret Validation**: All webhook requests are validated with a secret token
- **Admin Access Control**: Middleware-based admin restrictions with configurable admin ID
- **Input Validation**: Built-in validation utilities prevent malicious input
- **Error Handling**: Comprehensive error management prevents information leakage
- **Type Safety**: Full TypeScript coverage prevents runtime errors
- **Modular Security**: Security concerns are isolated in dedicated middleware

## 🌐 Endpoints

- **`GET /test`**: Test endpoint for development (sends message to admin)
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
