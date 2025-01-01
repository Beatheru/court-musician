import { Command } from "@models/command.model";
import config from "@utils/config";
import { checkForVoice } from "@utils/utils";
import { useQueue } from "discord-player";
import { Message } from "discord.js";

const command: Command = {
  name: "pause",
  description: "Pauses the bot.",
  usage: `${config.prefix}pause`,
  async run(message: Message) {
    if (!checkForVoice(message)) return;

    const queue = useQueue(message.guild!.id);
    if (!queue) return;

    queue.node.setPaused(true);
  }
};

export default command;
