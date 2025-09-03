import type { Update, Message } from 'typegram';
import { TelegramApi } from './TelegramApi';

export class Context {
    public readonly update: Update;
    public readonly api: TelegramApi;

    constructor(update: Update, api: TelegramApi) {
        this.update = update;
        this.api = api;
    }

    get message(): Message | undefined {
        return (this.update as any).message || (this.update as any).edited_message || (this.update as any).channel_post || (this.update as any).edited_channel_post;
    }

    get chatId(): number | undefined {
        return this.message?.chat.id;
    }

    async reply(text: string, extra?: Record<string, any>): Promise<void> {
        if (this.chatId) {
            await this.api.sendMessage(this.chatId, text, extra);
        } else {
            console.error("Could not find chat ID to reply to.");
        }
    }
}
