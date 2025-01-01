import { Command } from "@models/command.model";
import config from "@utils/config";
import { checkForVoice } from "@utils/utils";
import { useQueue } from "discord-player";
import { Message } from "discord.js";

const command: Command = {
  name: "resume",
  description: "Resumes the bot.",
  usage: `${config.prefix}resume`,
  async run(message: Message) {
    if (!checkForVoice(message)) return;

    const queue = useQueue(message.guild!.id);
    if (!queue) return;
    queue.node.setPaused(false);
  }
};

export default command;
