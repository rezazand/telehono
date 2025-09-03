import { Context } from "../context";

export const helpHandler = async (ctx: Context) => {
  const helpText = `
🤖 *Bot Commands:*

/start - Start the bot
/help - Show this help message
/echo <text> - Echo your message back

💬 *Text Commands:*
• Send "hi" to get a greeting

🎨 *Features:*
• Send a sticker and I'll respond
• Admin-only commands available for authorized users

Need more help? Contact the bot administrator.
  `.trim();
  
  await ctx.replyWithMarkdown(helpText);
};
