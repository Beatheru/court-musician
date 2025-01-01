import { Command } from "@models/command.model";
import config from "@utils/config";
import { checkForVoice } from "@utils/utils";
import { useQueue } from "discord-player";
import { Message } from "discord.js";

const command: Command = {
  name: "shuffle",
  description: "Shuffles the queue.",
  usage: `${config.prefix}shuffle`,
  async run(message: Message) {
    if (!checkForVoice(message)) return;

    const queue = useQueue(message.guild!.id);
    if (!queue) return;
    queue.tracks.shuffle();
  }
};

export default command;
