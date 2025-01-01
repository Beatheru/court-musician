import { Command } from "@models/command.model";
import config from "@utils/config";
import { checkForVoice } from "@utils/utils";
import { useQueue } from "discord-player";
import { Message } from "discord.js";

const command: Command = {
  name: "seek",
  description: "Seek to the position of the track in seconds.",
  usage: `${config.prefix}seek <seconds>`,
  async run(message: Message) {
    if (!checkForVoice(message)) return;

    const queue = useQueue(message.guild!.id);
    if (!queue) return;

    const position = parseInt(message.content.split(/\s+/)[1]);
    queue.node.seek(position * 1000);
  }
};

export default command;
