import { Command } from "@models/command.model";
import config from "@utils/config";
import { checkForVoice } from "@utils/utils";
import { useQueue } from "discord-player";
import { Message } from "discord.js";

const command: Command = {
  name: "skip",
  description: "Skip the current song.",
  usage: `${config.prefix}skip`,
  async run(message: Message) {
    if (!checkForVoice(message)) return;

    const queue = useQueue(message.guild!.id);
    queue?.node.skip();
  }
};

export default command;
