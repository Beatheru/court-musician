import config from "@utils/config";
import { Message } from "discord.js";
import play from "./play";
import { Command } from "@models/command.model";

const command: Command = {
  name: "playtop",
  description:
    "If the bot is already playing, queue the next song at the front of the queue.",
  usage: `${config.prefix}playtop <url or search term>`,
  async run(message: Message) {
    play.run(message, { top: true });
  }
};

export default command;
