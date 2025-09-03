import { Context } from "../context";

export const infoHandler = async (ctx : Context)=>{
    try {
        const info = await ctx.api.getMe();
        const formattedInfo = JSON.stringify(info, null, 2);
        await ctx.replyWithMarkdown(`Bot Information:\n\`\`\`json\n${formattedInfo}\n\`\`\``);
    } catch (error) {
        await ctx.reply('❌ Failed to retrieve bot information.');
    }
}