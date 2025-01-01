import { Message } from "discord.js";

export interface Command {
  name: string;
  description: string;
  usage: string;
  run(message: Message, additionalArgs?: Args): Promise<void>;
}

export interface Args {
  top?: boolean;
}
