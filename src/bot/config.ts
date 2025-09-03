import { Handler } from "./types";
import { echoHandler } from "./handlers/echo";
import { helpHandler } from "./handlers/help";
import { hiHandler } from "./handlers/hi";
import { startHandler } from "./handlers/start";
import { stickerHandler } from "./handlers/sticker";
import { infoHandler } from "./handlers/info";
import { statsHandler } from "./handlers/stats";

export const handlers: Handler[] = [
  { type: "command", trigger: "start", handler: startHandler },
  { type: "command", trigger: "help", handler: helpHandler },
  { type: "command", trigger: "echo", handler: echoHandler },
  { type: "text", trigger: "hi", handler: hiHandler },
  { type: "event", trigger: "sticker", handler: stickerHandler },
];

// Admin-only handlers
export const adminHandlers = (): Handler[] => [
  { 
    type: 'command',
    trigger: 'info', 
    handler: infoHandler
  },
  {
    type: 'command',
    trigger: 'stats',
    handler: statsHandler
  }
];