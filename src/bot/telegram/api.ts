import type { 
    BotCommand, 
    BotCommandScope, 
    ChatAdministratorRights, 
    ChatPermissions, 
    ForceReply, 
    InlineKeyboardButton, 
    InlineKeyboardMarkup, 
    InputMedia, 
    KeyboardButton, 
    MenuButton, 
    MessageEntity,
    ParseMode,
    ReplyKeyboardMarkup, 
    ReplyKeyboardRemove 
} from "typegram";

// Keyboard and markup interfaces
export class TelegramApi {
    private URL: string;

    constructor(token: string) {
        this.URL = `https://api.telegram.org/bot${token}/`;
    }

    private async call(method: string, params?: Record<string, any>) {
        const response = await fetch(`${this.URL}${method}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: params ? JSON.stringify(params) : undefined
        });
        const json = await response.json();
        if (!response.ok) {
            console.error(`Telegram API error for method ${method}:`, json);
        }
        return json;
    }

    // Getting information
    async getMe() {
        return this.call("getMe");
    }

    // Sending messages
    async sendMessage(chatId: number, text: string, extra: Record<string, any> = {}) {
        return this.call("sendMessage", {
            chat_id: chatId,
            text: text,
            ...extra
        });
    }

    async sendPhoto(chatId: number, photo: string, extra: Record<string, any> = {}) {
        return this.call("sendPhoto", {
            chat_id: chatId,
            photo: photo,
            ...extra
        });
    }

    async sendAudio(chatId: number, audio: string, extra: Record<string, any> = {}) {
        return this.call("sendAudio", {
            chat_id: chatId,
            audio: audio,
            ...extra
        });
    }

    async sendDocument(chatId: number, document: string, extra: Record<string, any> = {}) {
        return this.call("sendDocument", {
            chat_id: chatId,
            document: document,
            ...extra
        });
    }

    async sendVideo(chatId: number, video: string, extra: Record<string, any> = {}) {
        return this.call("sendVideo", {
            chat_id: chatId,
            video: video,
            ...extra
        });
    }

    async sendAnimation(chatId: number, animation: string, extra: Record<string, any> = {}) {
        return this.call("sendAnimation", {
            chat_id: chatId,
            animation: animation,
            ...extra
        });
    }

    async sendVoice(chatId: number, voice: string, extra: Record<string, any> = {}) {
        return this.call("sendVoice", {
            chat_id: chatId,
            voice: voice,
            ...extra
        });
    }

    async sendVideoNote(chatId: number, videoNote: string, extra: Record<string, any> = {}) {
        return this.call("sendVideoNote", {
            chat_id: chatId,
            video_note: videoNote,
            ...extra
        });
    }

    async sendSticker(chatId: number, sticker: string, extra: Record<string, any> = {}) {
        return this.call("sendSticker", {
            chat_id: chatId,
            sticker: sticker,
            ...extra
        });
    }

    // Editing messages
    async editMessageText(chatId: number, messageId: number, text: string, extra: Record<string, any> = {}) {
        return this.call("editMessageText", {
            chat_id: chatId,
            message_id: messageId,
            text: text,
            ...extra
        });
    }

    async editMessageCaption(chatId: number, messageId: number, caption: string, extra: Record<string, any> = {}) {
        return this.call("editMessageCaption", {
            chat_id: chatId,
            message_id: messageId,
            caption: caption,
            ...extra
        });
    }

    async editMessageMedia(chatId: number, messageId: number, media: InputMedia<string>, extra: Record<string, any> = {}) {
        return this.call("editMessageMedia", {
            chat_id: chatId,
            message_id: messageId,
            media: media,
            ...extra
        });
    }

    async editMessageReplyMarkup(chatId: number, messageId: number, replyMarkup: InlineKeyboardMarkup, extra: Record<string, any> = {}) {
        return this.call("editMessageReplyMarkup", {
            chat_id: chatId,
            message_id: messageId,
            reply_markup: replyMarkup,
            ...extra
        });
    }

    // Deleting messages
    async deleteMessage(chatId: number, messageId: number) {
        return this.call("deleteMessage", {
            chat_id: chatId,
            message_id: messageId
        });
    }

    // Other methods
    async answerCallbackQuery(callbackQueryId: string, extra: Record<string, any> = {}) {
        return this.call("answerCallbackQuery", {
            callback_query_id: callbackQueryId,
            ...extra
        });
    }

    async forwardMessage(chatId: number, fromChatId: number, messageId: number, extra: Record<string, any> = {}) {
        return this.call("forwardMessage", {
            chat_id: chatId,
            from_chat_id: fromChatId,
            message_id: messageId,
            ...extra
        });
    }

    async setWebhook(url: string, secret_token?: string) {
        return this.call("setWebhook", { url, secret_token });
    }

    async deleteWebhook(drop_pending_updates?: boolean) {
        return this.call("deleteWebhook", { drop_pending_updates });
    }

    async getWebhookInfo() {
        return this.call("getWebhookInfo");
    }

    // Getting updates
    async getUpdates(offset?: number, limit?: number, timeout?: number, allowed_updates?: string[]) {
        return this.call("getUpdates", {
            offset,
            limit,
            timeout,
            allowed_updates
        });
    }

    // Available methods
    async getUserProfilePhotos(userId: number, offset?: number, limit?: number) {
        return this.call("getUserProfilePhotos", {
            user_id: userId,
            offset,
            limit
        });
    }

    async getFile(fileId: string) {
        return this.call("getFile", {
            file_id: fileId
        });
    }

    async banChatMember(chatId: number | string, userId: number, until_date?: number, revoke_messages?: boolean) {
        return this.call("banChatMember", {
            chat_id: chatId,
            user_id: userId,
            until_date,
            revoke_messages
        });
    }

    async unbanChatMember(chatId: number | string, userId: number, only_if_banned?: boolean) {
        return this.call("unbanChatMember", {
            chat_id: chatId,
            user_id: userId,
            only_if_banned
        });
    }

    async restrictChatMember(chatId: number | string, userId: number, permissions: ChatPermissions, until_date?: number) {
        return this.call("restrictChatMember", {
            chat_id: chatId,
            user_id: userId,
            permissions,
            until_date
        });
    }

    async promoteChatMember(chatId: number | string, userId: number, extra: Record<string, any> = {}) {
        return this.call("promoteChatMember", {
            chat_id: chatId,
            user_id: userId,
            ...extra
        });
    }

    async setChatAdministratorCustomTitle(chatId: number | string, userId: number, customTitle: string) {
        return this.call("setChatAdministratorCustomTitle", {
            chat_id: chatId,
            user_id: userId,
            custom_title: customTitle
        });
    }

    async banChatSenderChat(chatId: number | string, senderChatId: number) {
        return this.call("banChatSenderChat", {
            chat_id: chatId,
            sender_chat_id: senderChatId
        });
    }

    async unbanChatSenderChat(chatId: number | string, senderChatId: number) {
        return this.call("unbanChatSenderChat", {
            chat_id: chatId,
            sender_chat_id: senderChatId
        });
    }

    async setChatPermissions(chatId: number | string, permissions: ChatPermissions) {
        return this.call("setChatPermissions", {
            chat_id: chatId,
            permissions
        });
    }

    async exportChatInviteLink(chatId: number | string) {
        return this.call("exportChatInviteLink", {
            chat_id: chatId
        });
    }

    async createChatInviteLink(chatId: number | string, extra: Record<string, any> = {}) {
        return this.call("createChatInviteLink", {
            chat_id: chatId,
            ...extra
        });
    }

    async editChatInviteLink(chatId: number | string, inviteLink: string, extra: Record<string, any> = {}) {
        return this.call("editChatInviteLink", {
            chat_id: chatId,
            invite_link: inviteLink,
            ...extra
        });
    }

    async revokeChatInviteLink(chatId: number | string, inviteLink: string) {
        return this.call("revokeChatInviteLink", {
            chat_id: chatId,
            invite_link: inviteLink
        });
    }

    async approveChatJoinRequest(chatId: number | string, userId: number) {
        return this.call("approveChatJoinRequest", {
            chat_id: chatId,
            user_id: userId
        });
    }

    async declineChatJoinRequest(chatId: number | string, userId: number) {
        return this.call("declineChatJoinRequest", {
            chat_id: chatId,
            user_id: userId
        });
    }

    async setChatPhoto(chatId: number | string, photo: string) {
        return this.call("setChatPhoto", {
            chat_id: chatId,
            photo
        });
    }

    async deleteChatPhoto(chatId: number | string) {
        return this.call("deleteChatPhoto", {
            chat_id: chatId
        });
    }

    async setChatTitle(chatId: number | string, title: string) {
        return this.call("setChatTitle", {
            chat_id: chatId,
            title
        });
    }

    async setChatDescription(chatId: number | string, description?: string) {
        return this.call("setChatDescription", {
            chat_id: chatId,
            description
        });
    }

    async pinChatMessage(chatId: number | string, messageId: number, disable_notification?: boolean) {
        return this.call("pinChatMessage", {
            chat_id: chatId,
            message_id: messageId,
            disable_notification
        });
    }

    async unpinChatMessage(chatId: number | string, messageId?: number) {
        return this.call("unpinChatMessage", {
            chat_id: chatId,
            message_id: messageId
        });
    }

    async unpinAllChatMessages(chatId: number | string) {
        return this.call("unpinAllChatMessages", {
            chat_id: chatId
        });
    }

    async leaveChat(chatId: number | string) {
        return this.call("leaveChat", {
            chat_id: chatId
        });
    }

    async getChat(chatId: number | string) {
        return this.call("getChat", {
            chat_id: chatId
        });
    }

    async getChatAdministrators(chatId: number | string) {
        return this.call("getChatAdministrators", {
            chat_id: chatId
        });
    }

    async getChatMemberCount(chatId: number | string) {
        return this.call("getChatMemberCount", {
            chat_id: chatId
        });
    }

    async getChatMember(chatId: number | string, userId: number) {
        return this.call("getChatMember", {
            chat_id: chatId,
            user_id: userId
        });
    }

    async setChatStickerSet(chatId: number | string, stickerSetName: string) {
        return this.call("setChatStickerSet", {
            chat_id: chatId,
            sticker_set_name: stickerSetName
        });
    }

    async deleteChatStickerSet(chatId: number | string) {
        return this.call("deleteChatStickerSet", {
            chat_id: chatId
        });
    }

    // Forum topic management
    async getForumTopicIconStickers() {
        return this.call("getForumTopicIconStickers");
    }

    async createForumTopic(chatId: number | string, name: string, extra: Record<string, any> = {}) {
        return this.call("createForumTopic", {
            chat_id: chatId,
            name,
            ...extra
        });
    }

    async editForumTopic(chatId: number | string, messageThreadId: number, extra: Record<string, any> = {}) {
        return this.call("editForumTopic", {
            chat_id: chatId,
            message_thread_id: messageThreadId,
            ...extra
        });
    }

    async closeForumTopic(chatId: number | string, messageThreadId: number) {
        return this.call("closeForumTopic", {
            chat_id: chatId,
            message_thread_id: messageThreadId
        });
    }

    async reopenForumTopic(chatId: number | string, messageThreadId: number) {
        return this.call("reopenForumTopic", {
            chat_id: chatId,
            message_thread_id: messageThreadId
        });
    }

    async deleteForumTopic(chatId: number | string, messageThreadId: number) {
        return this.call("deleteForumTopic", {
            chat_id: chatId,
            message_thread_id: messageThreadId
        });
    }

    async unpinAllForumTopicMessages(chatId: number | string, messageThreadId: number) {
        return this.call("unpinAllForumTopicMessages", {
            chat_id: chatId,
            message_thread_id: messageThreadId
        });
    }

    async editGeneralForumTopic(chatId: number | string, name: string) {
        return this.call("editGeneralForumTopic", {
            chat_id: chatId,
            name
        });
    }

    async closeGeneralForumTopic(chatId: number | string) {
        return this.call("closeGeneralForumTopic", {
            chat_id: chatId
        });
    }

    async reopenGeneralForumTopic(chatId: number | string) {
        return this.call("reopenGeneralForumTopic", {
            chat_id: chatId
        });
    }

    async hideGeneralForumTopic(chatId: number | string) {
        return this.call("hideGeneralForumTopic", {
            chat_id: chatId
        });
    }

    async unhideGeneralForumTopic(chatId: number | string) {
        return this.call("unhideGeneralForumTopic", {
            chat_id: chatId
        });
    }

    // Sending media groups
    async sendMediaGroup(chatId: number | string, media: InputMedia<string>[], extra: Record<string, any> = {}) {
        return this.call("sendMediaGroup", {
            chat_id: chatId,
            media,
            ...extra
        });
    }

    async sendLocation(chatId: number | string, latitude: number, longitude: number, extra: Record<string, any> = {}) {
        return this.call("sendLocation", {
            chat_id: chatId,
            latitude,
            longitude,
            ...extra
        });
    }

    async editMessageLiveLocation(chatId: number | string, messageId: number, latitude: number, longitude: number, extra: Record<string, any> = {}) {
        return this.call("editMessageLiveLocation", {
            chat_id: chatId,
            message_id: messageId,
            latitude,
            longitude,
            ...extra
        });
    }

    async editMessageLiveLocationInline(inlineMessageId: string, latitude: number, longitude: number, extra: Record<string, any> = {}) {
        return this.call("editMessageLiveLocation", {
            inline_message_id: inlineMessageId,
            latitude,
            longitude,
            ...extra
        });
    }

    async stopMessageLiveLocation(chatId: number | string, messageId: number, extra: Record<string, any> = {}) {
        return this.call("stopMessageLiveLocation", {
            chat_id: chatId,
            message_id: messageId,
            ...extra
        });
    }

    async stopMessageLiveLocationInline(inlineMessageId: string, extra: Record<string, any> = {}) {
        return this.call("stopMessageLiveLocation", {
            inline_message_id: inlineMessageId,
            ...extra
        });
    }

    async sendVenue(chatId: number | string, latitude: number, longitude: number, title: string, address: string, extra: Record<string, any> = {}) {
        return this.call("sendVenue", {
            chat_id: chatId,
            latitude,
            longitude,
            title,
            address,
            ...extra
        });
    }

    async sendContact(chatId: number | string, phoneNumber: string, firstName: string, extra: Record<string, any> = {}) {
        return this.call("sendContact", {
            chat_id: chatId,
            phone_number: phoneNumber,
            first_name: firstName,
            ...extra
        });
    }

    async sendPoll(chatId: number | string, question: string, options: string[], extra: Record<string, any> = {}) {
        return this.call("sendPoll", {
            chat_id: chatId,
            question,
            options,
            ...extra
        });
    }

    async sendDice(chatId: number | string, emoji?: string, extra: Record<string, any> = {}) {
        return this.call("sendDice", {
            chat_id: chatId,
            emoji,
            ...extra
        });
    }

    async sendChatAction(chatId: number | string, action: string, extra: Record<string, any> = {}) {
        return this.call("sendChatAction", {
            chat_id: chatId,
            action,
            ...extra
        });
    }

    async stopPoll(chatId: number | string, messageId: number, replyMarkup?: InlineKeyboardMarkup) {
        return this.call("stopPoll", {
            chat_id: chatId,
            message_id: messageId,
            reply_markup: replyMarkup
        });
    }

    // Inline mode
    async answerInlineQuery(inlineQueryId: string, results: any[], extra: Record<string, any> = {}) {
        return this.call("answerInlineQuery", {
            inline_query_id: inlineQueryId,
            results,
            ...extra
        });
    }

    async answerWebAppQuery(webAppQueryId: string, result: any) {
        return this.call("answerWebAppQuery", {
            web_app_query_id: webAppQueryId,
            result
        });
    }

    // Payments
    async sendInvoice(chatId: number | string, title: string, description: string, payload: string, providerToken: string, currency: string, prices: any[], extra: Record<string, any> = {}) {
        return this.call("sendInvoice", {
            chat_id: chatId,
            title,
            description,
            payload,
            provider_token: providerToken,
            currency,
            prices,
            ...extra
        });
    }

    async createInvoiceLink(title: string, description: string, payload: string, providerToken: string, currency: string, prices: any[], extra: Record<string, any> = {}) {
        return this.call("createInvoiceLink", {
            title,
            description,
            payload,
            provider_token: providerToken,
            currency,
            prices,
            ...extra
        });
    }

    async answerShippingQuery(shippingQueryId: string, ok: boolean, extra: Record<string, any> = {}) {
        return this.call("answerShippingQuery", {
            shipping_query_id: shippingQueryId,
            ok,
            ...extra
        });
    }

    async answerPreCheckoutQuery(preCheckoutQueryId: string, ok: boolean, errorMessage?: string) {
        return this.call("answerPreCheckoutQuery", {
            pre_checkout_query_id: preCheckoutQueryId,
            ok,
            error_message: errorMessage
        });
    }

    // Telegram Passport
    async setPassportDataErrors(userId: number, errors: any[]) {
        return this.call("setPassportDataErrors", {
            user_id: userId,
            errors
        });
    }

    // Games
    async sendGame(chatId: number, gameShortName: string, extra: Record<string, any> = {}) {
        return this.call("sendGame", {
            chat_id: chatId,
            game_short_name: gameShortName,
            ...extra
        });
    }

    async setGameScore(userId: number, score: number, extra: Record<string, any> = {}) {
        return this.call("setGameScore", {
            user_id: userId,
            score,
            ...extra
        });
    }

    async getGameHighScores(userId: number, extra: Record<string, any> = {}) {
        return this.call("getGameHighScores", {
            user_id: userId,
            ...extra
        });
    }

    // Bot commands
    async setMyCommands(commands: BotCommand[], scope?: BotCommandScope, languageCode?: string) {
        return this.call("setMyCommands", {
            commands,
            scope,
            language_code: languageCode
        });
    }

    async deleteMyCommands(scope?: BotCommandScope, languageCode?: string) {
        return this.call("deleteMyCommands", {
            scope,
            language_code: languageCode
        });
    }

    async getMyCommands(scope?: BotCommandScope, languageCode?: string) {
        return this.call("getMyCommands", {
            scope,
            language_code: languageCode
        });
    }

    async setMyName(name?: string, languageCode?: string) {
        return this.call("setMyName", {
            name,
            language_code: languageCode
        });
    }

    async getMyName(languageCode?: string) {
        return this.call("getMyName", {
            language_code: languageCode
        });
    }

    async setMyDescription(description?: string, languageCode?: string) {
        return this.call("setMyDescription", {
            description,
            language_code: languageCode
        });
    }

    async getMyDescription(languageCode?: string) {
        return this.call("getMyDescription", {
            language_code: languageCode
        });
    }

    async setMyShortDescription(shortDescription?: string, languageCode?: string) {
        return this.call("setMyShortDescription", {
            short_description: shortDescription,
            language_code: languageCode
        });
    }

    async getMyShortDescription(languageCode?: string) {
        return this.call("getMyShortDescription", {
            language_code: languageCode
        });
    }

    async setChatMenuButton(chatId?: number, menuButton?: MenuButton) {
        return this.call("setChatMenuButton", {
            chat_id: chatId,
            menu_button: menuButton
        });
    }

    async getChatMenuButton(chatId?: number) {
        return this.call("getChatMenuButton", {
            chat_id: chatId
        });
    }

    async setMyDefaultAdministratorRights(rights?: ChatAdministratorRights, forChannels?: boolean) {
        return this.call("setMyDefaultAdministratorRights", {
            rights,
            for_channels: forChannels
        });
    }

    async getMyDefaultAdministratorRights(forChannels?: boolean) {
        return this.call("getMyDefaultAdministratorRights", {
            for_channels: forChannels
        });
    }

    // Stickers
    async getStickerSet(name: string) {
        return this.call("getStickerSet", {
            name
        });
    }

    async getCustomEmojiStickers(customEmojiIds: string[]) {
        return this.call("getCustomEmojiStickers", {
            custom_emoji_ids: customEmojiIds
        });
    }

    async uploadStickerFile(userId: number, sticker: any, stickerFormat: string) {
        return this.call("uploadStickerFile", {
            user_id: userId,
            sticker,
            sticker_format: stickerFormat
        });
    }

    async createNewStickerSet(userId: number, name: string, title: string, stickers: any[], stickerFormat: string, extra: Record<string, any> = {}) {
        return this.call("createNewStickerSet", {
            user_id: userId,
            name,
            title,
            stickers,
            sticker_format: stickerFormat,
            ...extra
        });
    }

    async addStickerToSet(userId: number, name: string, sticker: any) {
        return this.call("addStickerToSet", {
            user_id: userId,
            name,
            sticker
        });
    }

    async setStickerPositionInSet(sticker: string, position: number) {
        return this.call("setStickerPositionInSet", {
            sticker,
            position
        });
    }

    async deleteStickerFromSet(sticker: string) {
        return this.call("deleteStickerFromSet", {
            sticker
        });
    }

    async setStickerEmojiList(sticker: string, emojiList: string[]) {
        return this.call("setStickerEmojiList", {
            sticker,
            emoji_list: emojiList
        });
    }

    async setStickerKeywords(sticker: string, keywords?: string[]) {
        return this.call("setStickerKeywords", {
            sticker,
            keywords
        });
    }

    async setStickerMaskPosition(sticker: string, maskPosition?: any) {
        return this.call("setStickerMaskPosition", {
            sticker,
            mask_position: maskPosition
        });
    }

    async setStickerSetTitle(name: string, title: string) {
        return this.call("setStickerSetTitle", {
            name,
            title
        });
    }

    async setStickerSetThumbnail(name: string, userId: number, thumbnail?: any) {
        return this.call("setStickerSetThumbnail", {
            name,
            user_id: userId,
            thumbnail
        });
    }

    async deleteStickerSet(name: string) {
        return this.call("deleteStickerSet", {
            name
        });
    }

    // Helper methods for creating markups
    static createInlineKeyboard(buttons: InlineKeyboardButton[][]): InlineKeyboardMarkup {
        return {
            inline_keyboard: buttons
        };
    }

    static createReplyKeyboard(buttons: KeyboardButton[][], options: Partial<ReplyKeyboardMarkup> = {}): ReplyKeyboardMarkup {
        return {
            keyboard: buttons,
            resize_keyboard: true,
            ...options
        };
    }

    static createReplyKeyboardRemove(selective?: boolean): ReplyKeyboardRemove {
        return {
            remove_keyboard: true,
            selective
        };
    }

    static createForceReply(inputFieldPlaceholder?: string, selective?: boolean): ForceReply {
        return {
            force_reply: true,
            input_field_placeholder: inputFieldPlaceholder,
            selective
        };
    }

    // Helper methods for creating specific types of inline buttons
    static createUrlButton(text: string, url: string): InlineKeyboardButton {
        return { text, url };
    }

    static createCallbackButton(text: string, callback_data: string): InlineKeyboardButton {
        return { text, callback_data };
    }

    static createWebAppButton(text: string, web_app: { url: string }): InlineKeyboardButton {
        return { text, web_app };
    }

    static createSwitchInlineButton(text: string, switch_inline_query: string): InlineKeyboardButton {
        return { text, switch_inline_query };
    }

    static createSwitchInlineCurrentChatButton(text: string, switch_inline_query_current_chat: string): InlineKeyboardButton {
        return { text, switch_inline_query_current_chat };
    }

    // Generic method for advanced use cases
    static createInlineButton(text: string, options: any): InlineKeyboardButton {
        return { text, ...options } as InlineKeyboardButton;
    }

    static createKeyboardButton(
        text: string, 
        options: Record<string, any> = {}
    ): KeyboardButton {
        return { text, ...options } as KeyboardButton;
    }
}
