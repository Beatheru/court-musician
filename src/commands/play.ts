import { Command } from "@models/command.model";
import { checkForVoice, findBestMatch } from "@utils/utils";
import {
  QueryType,
  SearchQueryType,
  SearchResult,
  Track,
  useMainPlayer,
  useQueue
} from "discord-player";
import {
  ChatInputCommandInteraction,
  GuildMember,
  SlashCommandBuilder
} from "discord.js";
import fs from "fs";
import path from "path";

// @TODO: Break functions up.
// @TODO: Possibly separate the file search into a new command.
// @TODO: Fix searching queries (only get first result).
const command: Command = {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Play a song or an uploaded file.")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("song")
        .setDescription("Play a song.")
        .addStringOption((option) =>
          option
            .setName("search")
            .setDescription("Search query or url.")
            .setRequired(true)
        )
        .addBooleanOption((option) =>
          option.setName("top").setDescription("Add to the front of the queue.")
        )
        .addStringOption((option) =>
          option
            .setName("engine")
            .setDescription("Place to search from. Defaults to auto.")
            .addChoices(
              { name: "youtube", value: "youtube" },
              { name: "spotify", value: "spotify" },
              { name: "soundcloud", value: "soundcloud" }
            )
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("file")
        .setDescription("Play an uploaded file.")
        .addStringOption((option) =>
          option
            .setName("search")
            .setDescription("File name.")
            .setRequired(true)
        )
    ),
  async run(interaction: ChatInputCommandInteraction) {
    if (!checkForVoice(interaction)) return;

    await interaction.deferReply({ ephemeral: true });

    let query = interaction.options.getString("search")!;
    let engine =
      (interaction.options.getString("engine") as SearchQueryType) ?? "auto";

    if (interaction.options.getSubcommand() === "file") {
      engine = QueryType.FILE;
      const files: string[] = [];
      const paths: string[] = [];
      const getFilesRecursively = (directory: string) => {
        const filesInDirectory = fs.readdirSync(directory);
        for (const file of filesInDirectory) {
          const absolute = path.join(directory, file);
          if (fs.statSync(absolute).isDirectory()) {
            getFilesRecursively(absolute);
          } else {
            files.push(file);
            paths.push(absolute);
          }
        }
      };

      getFilesRecursively(path.join(__dirname, "..", "..", "uploads"));

      const file = findBestMatch(query, files);
      if (!file) {
        interaction.reply({
          content: "No results found",
          ephemeral: true
        });

        return;
      }

      query = path.join(__dirname, "..", "..", "uploads", file);
    }

    const player = useMainPlayer();
    const search = await player.search(query, {
      searchEngine: engine
    });

    if (search.isEmpty()) {
      interaction.reply({
        content: "No results found",
        ephemeral: true
      });

      return;
    }

    const result = parseSearchResult(search, query);

    const queue = useQueue(interaction.guild!.id);
    if (queue?.node.isPlaying() && interaction.options.getBoolean("top")) {
      if (result instanceof SearchResult) {
        result.tracks.forEach((track) => {
          queue?.insertTrack(track, 0);
        });
      } else if (result instanceof Track) {
        queue?.insertTrack(result, 0);
      }

      await interaction.deleteReply();

      return;
    }

    await player.play(
      (interaction.member as GuildMember).voice.channel!,
      result,
      {
        nodeOptions: {
          volume: 15
        },
        connectionOptions: {
          deaf: false
        }
      }
    );

    await interaction.deleteReply();
  }
};

/**
 * Checks if the query string is a single track in a Youtube playlist (defined by the index parameter).
 * If it is then return the single Track object from the playlist instead of the whole Playlist.
 * Otherwise, return the original SearchResult unmodified.
 */
function parseSearchResult(
  search: SearchResult,
  query: string
): SearchResult | Track {
  if (search.hasPlaylist()) {
    const isSingleTrackInPlaylist = query.match(/index=(\d+)$/);
    if (isSingleTrackInPlaylist) {
      const index = Number(isSingleTrackInPlaylist[0].slice(6)) - 1;
      return search.tracks[index];
    }
  }

  return search;
}

export default command;
