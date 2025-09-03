import { Context } from "../context";
import { InputValidator } from "../utils/validation";

export const echoHandler = async (ctx: Context) => {
  const validation = InputValidator.validateCommand(ctx, 1);
  if (!validation.isValid) {
    await ctx.reply('Please provide text to echo. Usage: /echo <your message>');
    return;
  }

  const text = InputValidator.getCommandText(ctx);
  const lengthValidation = InputValidator.validateTextLength(text, 1000);
  
  if (!lengthValidation.isValid) {
    await ctx.reply(lengthValidation.error!);
    return;
  }

  await ctx.reply(`You said: ${text}`);
};
