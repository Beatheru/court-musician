import { Command } from "@models/command.model";
import config from "@utils/config";
import { checkForVoice } from "@utils/utils";
import { useQueue } from "discord-player";
import { Message } from "discord.js";

const command: Command = {
  name: "clear",
  description: "Clears the queue.",
  usage: `${config.prefix}clear`,
  async run(message: Message) {
    if (!checkForVoice(message)) return;

    const queue = useQueue(message.guild!.id);
    if (!queue) return;

    queue.clear();
  }
};

export default command;
