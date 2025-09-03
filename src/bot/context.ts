import type { Update, Message, User } from 'typegram';
import { TelegramApi } from './telegram/api';

export class Context {
    public readonly update: Update;
    public readonly api: TelegramApi;

    constructor(update: Update, api: TelegramApi) {
        this.update = update;
        this.api = api;
    }

    get message(): Message | undefined {
        return (this.update as any).message || 
               (this.update as any).edited_message || 
               (this.update as any).channel_post || 
               (this.update as any).edited_channel_post;
    }

    get chatId(): number | undefined {
        return this.message?.chat.id;
    }

    get user(): User | undefined {
        return this.message?.from;
    }

    get isPrivateChat(): boolean {
        return this.message?.chat.type === 'private';
    }

    get isGroupChat(): boolean {
        return this.message?.chat.type === 'group' || this.message?.chat.type === 'supergroup';
    }

    async reply(text: string, extra?: Record<string, any>): Promise<void> {
        if (!this.chatId) {
            throw new Error("Could not find chat ID to reply to.");
        }
        
        if (!text || text.trim().length === 0) {
            throw new Error("Reply text cannot be empty.");
        }

        await this.api.sendMessage(this.chatId, text, extra);
    }

    async replyWithMarkdown(text: string, extra?: Record<string, any>): Promise<void> {
        await this.reply(text, { ...extra, parse_mode: 'Markdown' });
    }

    async replyWithHTML(text: string, extra?: Record<string, any>): Promise<void> {
        await this.reply(text, { ...extra, parse_mode: 'HTML' });
    }
}
