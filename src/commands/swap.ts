import { Command } from "@models/command.model";
import { useQueue } from "discord-player";
import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("swap")
    .setDescription("Swap two songs in the queue.")
    .addIntegerOption((option) =>
      option
        .setName("from")
        .setDescription("Position of first song.")
        .setRequired(true)
    )
    .addIntegerOption((option) =>
      option
        .setName("to")
        .setDescription("Position of second song.")
        .setRequired(true)
    ),
  async run(interaction: ChatInputCommandInteraction) {
    const queue = useQueue(interaction.guild!.id);
    if (!queue) return;

    const from = interaction.options.getInteger("from")!;
    const to = interaction.options.getInteger("to")!;

    if (from === to) {
      await interaction.deferReply({ ephemeral: true });
      await interaction.deleteReply();

      return;
    }

    queue.swapTracks(from - 1, to - 1);

    await interaction.deferReply({ ephemeral: true });
    await interaction.deleteReply();
  }
} as Command;
