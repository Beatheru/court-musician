import { Command } from "@models/command.model";
import { checkForVoice } from "@utils/utils";
import { QueueRepeatMode, useQueue } from "discord-player";
import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("loop")
    .setDescription("Set the bot to loop the current song, the queue, or none.")
    .addStringOption((option) =>
      option
        .setName("type")
        .setDescription("Loop type.")
        .addChoices(
          { name: "none", value: "none" },
          { name: "track", value: "track" },
          { name: "queue", value: "queue" }
        )
        .setRequired(true)
    ),

  async run(interaction: ChatInputCommandInteraction) {
    if (!checkForVoice(interaction)) return;

    const queue = useQueue(interaction.guild!.id);
    if (!queue) return;

    const loopMode = interaction.options.getString("type")!;

    switch (loopMode) {
      case "none":
        console.log("Setting loop to", loopMode);
        queue.setRepeatMode(QueueRepeatMode.OFF);
        break;
      case "track":
        console.log("Setting loop to", loopMode);
        queue.setRepeatMode(QueueRepeatMode.TRACK);
        break;
      case "queue":
        console.log("Setting loop to", loopMode);
        queue.setRepeatMode(QueueRepeatMode.QUEUE);
        break;
    }

    await interaction.reply({
      content: `Loop mode set to ${loopMode}.`,
      ephemeral: true
    });
  }
} as Command;
