import { Command } from "@models/command.model";
import { checkForVoice } from "@utils/utils";
import { useQueue } from "discord-player";
import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("seek")
    .setDescription("Seek to the position of the track in seconds.")
    .addIntegerOption((option) =>
      option
        .setName("position")
        .setDescription("Position in seconds.")
        .setRequired(true)
    ),

  async run(interaction: ChatInputCommandInteraction) {
    if (!checkForVoice(interaction)) return;

    const queue = useQueue(interaction.guild!.id);
    if (!queue) return;

    const position = interaction.options.getInteger("position")!;
    queue.node.seek(position * 1000);

    await interaction.deferReply({
      ephemeral: true
    });
    await interaction.deleteReply();
  }
} as Command;
