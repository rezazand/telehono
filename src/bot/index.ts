import { TelegramApi } from './telegram/api';
import { Context } from './context';
import { Handler } from "./types";
import { errorHandler, Logger, ConsoleLogger } from './middleware/error';

export class Bot {
    public api: TelegramApi;
    private logger: Logger;

    constructor(token: string, logger: Logger = new ConsoleLogger()) {
        this.api = new TelegramApi(token);
        this.logger = logger;
    }

    async executeHandler(ctx: Context, handlers: Handler[]): Promise<void> {
        const withErrorHandling = errorHandler(this.logger);
        
        // Handle commands first (highest priority)
        if (ctx.message && 'text' in ctx.message && ctx.message.text.startsWith('/')) {
            const command = ctx.message.text.substring(1).split(' ')[0].toLowerCase();
            const commandHandler = handlers.find(h =>
                (h.type === 'command') && (h.trigger === command)
            );
            if (commandHandler) {
                return withErrorHandling(ctx, async (ctx) => commandHandler.handler(ctx));
            }
        }

        // Handle specific text messages (medium priority)
        if (ctx.message && 'text' in ctx.message) {
            const messageText = ctx.message.text;
            const textHandler = handlers.find(h => h.type === 'text' && h.trigger === messageText);
            if (textHandler) {
                return withErrorHandling(ctx, async (ctx) => textHandler.handler(ctx));
            }
        }

        // Handle other update types (lowest priority)
        const eventHandler = handlers.find(h => {
            if (h.type === 'event' && h.trigger) {
                return h.trigger in ctx.update || (ctx.message && h.trigger in ctx.message);
            }
            return false;
        });
        if (eventHandler) {
            return withErrorHandling(ctx, async (ctx) => eventHandler.handler(ctx));
        }
    }


    public async registerWebhook(url?: URL, suffix?: string, secret?: string): Promise<Response> {
        let webhookUrl = "";
        if (url && suffix) {
            webhookUrl = `${url.protocol}//${url.host}${suffix}`;
        }

        const r = await this.api.setWebhook(webhookUrl, secret) as { ok: boolean };
        return new Response(r.ok ? "Ok" : JSON.stringify(r, null, 2));
    }
}