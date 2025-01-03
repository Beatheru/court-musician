import { Command } from "@models/command.model";
import { checkForVoice } from "@utils/utils";
import { useQueue } from "discord-player";
import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("stop")
    .setDescription("Stops playing and disconnects the bot."),

  async run(interaction: ChatInputCommandInteraction) {
    if (!checkForVoice(interaction)) return;

    const queue = useQueue(interaction.guild!.id);
    queue?.delete();

    await interaction.deferReply({
      ephemeral: true
    });
    await interaction.deleteReply();
  }
} as Command;
