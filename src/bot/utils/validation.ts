import { Context } from "../context";

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export class InputValidator {
  static validateCommand(ctx: Context, requiredArgs: number = 0): ValidationResult {
    if (!ctx.message || !('text' in ctx.message)) {
      return { isValid: false, error: "No text message found" };
    }

    const args = ctx.message.text.split(' ').slice(1);
    if (args.length < requiredArgs) {
      return { 
        isValid: false, 
        error: `Command requires at least ${requiredArgs} argument(s), but got ${args.length}` 
      };
    }

    return { isValid: true };
  }

  static validateTextLength(text: string, maxLength: number = 4096): ValidationResult {
    if (text.length > maxLength) {
      return { 
        isValid: false, 
        error: `Text too long. Maximum ${maxLength} characters allowed.` 
      };
    }
    return { isValid: true };
  }

  static extractCommandArgs(ctx: Context): string[] {
    if (!ctx.message || !('text' in ctx.message)) {
      return [];
    }
    return ctx.message.text.split(' ').slice(1);
  }

  static getCommandText(ctx: Context): string {
    return this.extractCommandArgs(ctx).join(' ');
  }
}
