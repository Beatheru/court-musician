import { Command } from "@models/command.model";
import { checkForVoice } from "@utils/utils";
import { useQueue } from "discord-player";
import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder
} from "discord.js";

// @TODO: Reimplement this.
export default {
  data: new SlashCommandBuilder()
    .setName("queue")
    .setDescription("Shows the current queue (up to 15 tracks for now)."),
  async run(interaction: ChatInputCommandInteraction) {
    if (!checkForVoice(interaction)) return;

    const queue = useQueue(interaction.guild!.id);
    if (!queue) return;

    const embed = new EmbedBuilder();
    const tracks = queue.tracks.toArray();

    if (queue.currentTrack) {
      embed.addFields({
        name: `Now playing: ${queue.currentTrack.title} - ${queue.currentTrack.duration}`,
        value: `${queue.currentTrack.url}`,
        inline: false
      });
    }

    if (tracks.length === 0) {
      if (interaction.channel?.isSendable()) {
        interaction.channel.send({ embeds: [embed] });
      }

      return;
    }

    if (tracks.length > 15) {
      for (let i = 0; i < 15; i++) {
        embed.addFields({
          name: `${tracks[i].title} - ${tracks[i].duration}`,
          value: `${tracks[i].url}`,
          inline: false
        });
      }
    } else {
      for (const track of tracks) {
        embed.addFields({
          name: `${track.title} - ${track.duration}`,
          value: `${track.url}`,
          inline: false
        });
      }
    }

    if (interaction.channel?.isSendable()) {
      interaction.channel.send({ embeds: [embed] });
    }
  }
} as Command;
