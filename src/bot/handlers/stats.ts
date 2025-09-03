import { Context } from "../context";

export const statsHandler = async (ctx: Context)=>{
    const stats = {
        chatId: ctx.chatId,
        isPrivate: ctx.isPrivateChat,
        isGroup: ctx.isGroupChat,
        user: ctx.user?.first_name || 'Unknown',
        timestamp: new Date().toISOString()
    };
     await ctx.replyWithMarkdown(`*Admin Stats:*\n\`\`\`json\n${JSON.stringify(stats, null, 2)}\n\`\`\``);
}