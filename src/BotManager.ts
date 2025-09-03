import type { Update } from "typegram";
import { TelegramApi } from './TelegramApi';
import { Context } from './Context';

type Handler = (ctx: Context) => void | Promise<void>;
type Middleware = (ctx: Context, next: () => Promise<void>) => Promise<void>;

export class BotManager {
    public api: TelegramApi;
    private middlewares: Middleware[] = [];
    private eventHandlers: { [type: string]: Handler } = {};
    private textHandlers: { [text: string]: Handler } = {};
    private commandHandlers: { [command: string]: Handler } = {};

    constructor(token: string) {
        this.api = new TelegramApi(token);
    }

    async registerWebhook(url?: URL, suffix?: string, secret?: string) {
        let webhookUrl = ""
        if (url) {
            webhookUrl = `${url.protocol}//${url.hostname}${suffix}`;
        }
        const r = await this.api.setWebhook(webhookUrl, secret) as { ok: boolean };
        return new Response(r.ok ? "Ok" : JSON.stringify(r, null, 2));
    }

    async processUpdate(update: Update): Promise<void> {
        const ctx = new Context(update, this.api);
        
        // Execute middleware chain, then handlers
        await this.executeMiddlewareChain(ctx, 0);
    }

    private async executeMiddlewareChain(ctx: Context, index: number): Promise<void> {
        if (index >= this.middlewares.length) {
            // All middleware executed, now execute appropriate handler
            return this.executeHandler(ctx);
        }
        
        const middleware = this.middlewares[index];
        await middleware(ctx, () => this.executeMiddlewareChain(ctx, index + 1));
    }

    private async executeHandler(ctx: Context): Promise<void> {
        // Handle commands first (highest priority)
        if (ctx.message && 'text' in ctx.message && ctx.message.text.startsWith('/')) {
            const command = ctx.message.text.substring(1).split(' ')[0].toLowerCase();
            const handler = this.commandHandlers[command];
            if (handler) {
                return handler(ctx);
            }
        }

        // Handle specific text messages (medium priority)
        if (ctx.message && 'text' in ctx.message) {
            const handler = this.textHandlers[ctx.message.text];
            if (handler) {
                return handler(ctx);
            }
        }

        // Handle other update types (lowest priority)
        for (const [type, handler] of Object.entries(this.eventHandlers)) {
            if (type in ctx.update || (ctx.message && type in ctx.message)) {
                return handler(ctx);
            }
        }
    }

    // Middleware
    use(middleware: Middleware) {
        this.middlewares.push(middleware);
    }

    // Command handlers
    command(command: string, handler: Handler) {
        this.commandHandlers[command.toLowerCase()] = handler;
    }

    start(handler: Handler) {
        this.command('start', handler);
    }

    help(handler: Handler) {
        this.command('help', handler);
    }

    // Text message handlers
    text(text: string, handler: Handler) {
        this.textHandlers[text] = handler;
    }

    // Event handlers  
    event(type: string, handler: Handler) {
        this.eventHandlers[type] = handler;
    }

}