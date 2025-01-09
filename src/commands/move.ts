import { Command } from "@models/command.model";
import { useQueue } from "discord-player";
import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("move")
    .setDescription("Move a song to a specific position in the queue.")
    .addIntegerOption((option) =>
      option
        .setName("from")
        .setDescription("Position of song to move.")
        .setRequired(true)
    )
    .addIntegerOption((option) =>
      option
        .setName("to")
        .setDescription("Position to move to.")
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

    const track = queue.tracks.at(from - 1);

    if (from > to) {
      queue.removeTrack(from - 1);
      queue?.insertTrack(track!, to - 1);
    } else {
      queue.insertTrack(track!, to);
      queue.removeTrack(from - 1);
    }

    await interaction.deferReply({ ephemeral: true });
    await interaction.deleteReply();
  }
} as Command;
