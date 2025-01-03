import { Command } from "@models/command.model";
import { checkForVoice } from "@utils/utils";
import { useQueue } from "discord-player";
import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("shuffle")
    .setDescription("Shuffles the queue."),

  async run(interaction: ChatInputCommandInteraction) {
    if (!checkForVoice(interaction)) return;

    const queue = useQueue(interaction.guild!.id);
    if (!queue) return;

    queue.tracks.shuffle();

    await interaction.deferReply({
      ephemeral: true
    });
    await interaction.deleteReply();
  }
} as Command;
