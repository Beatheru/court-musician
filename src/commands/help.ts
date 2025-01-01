import { Command } from "@models/command.model";
import config from "@utils/config";
import { EmbedBuilder, Message } from "discord.js";
import { client } from "index";

const command: Command = {
  name: "help",
  description: "Shows list of commands.",
  usage: `${config.prefix}help`,
  async run(message: Message) {
    const commands = client.commands;
    const embed = new EmbedBuilder();

    for (const [name, command] of commands) {
      embed.addFields({
        name: `${config.prefix}${name}`,
        value: `${command.description} \n Usage: ${command.usage}`,
        inline: false
      });
    }

    if (message.channel.isSendable()) {
      message.channel.send({ embeds: [embed] });
    }
  }
};

export default command;
