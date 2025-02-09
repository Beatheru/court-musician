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
  AutocompleteInteraction,
  ChatInputCommandInteraction,
  GuildMember,
  SlashCommandBuilder
} from "discord.js";
import fs from "fs";
import path from "path";

export default {
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
            .setAutocomplete(true)
        )
        .addBooleanOption((option) =>
          option.setName("top").setDescription("Add to the front of the queue.")
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
            .setAutocomplete(true)
        )
        .addBooleanOption((option) =>
          option.setName("top").setDescription("Add to the front of the queue.")
        )
    ),
  async run(interaction: ChatInputCommandInteraction) {
    if (!checkForVoice(interaction)) return;

    await interaction.deferReply({ ephemeral: true });

    const { query, engine } = parseQuery(interaction);

    const player = useMainPlayer();
    const search = await player.search(query, {
      searchEngine: engine
    });

    if (search.isEmpty()) {
      await interaction.editReply({
        content: "No results found"
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
  },
  async autocomplete(interaction: AutocompleteInteraction) {
    const query = interaction.options.getString("search");
    if (!query) {
      await interaction.respond([]);
      return;
    }

    if (interaction.options.getSubcommand() === "file") {
      const files: string[] = getFilesRecursively(
        path.join(__dirname, "..", "..", "uploads")
      );

      await interaction.respond(
        files
          .filter((file) => file.toLowerCase().includes(query.toLowerCase()))
          .splice(0, Math.min(7, files.length))
          .map((choice) => ({
            name: choice,
            value: choice
          }))
      );
    } else {
      const player = useMainPlayer();
      const search = await player.search(query);

      if (search.hasPlaylist()) {
        await interaction.respond([
          {
            name: `${search.playlist!.title} - ${search.playlist!.author.name}`,
            value: search.playlist!.url
          }
        ]);

        return;
      } else if (search.hasTracks()) {
        await interaction.respond(
          search.tracks
            .splice(0, Math.min(7, search.tracks.length))
            .map((choice) => ({
              name: `${choice.title} - ${choice.author} - ${choice.duration}`,
              value: choice.url
            }))
        );

        return;
      }

      await interaction.respond([]);
    }
  }
} as Command;

/**
 * Helper function to get the
 * @param interaction
 * @returns
 */
function parseQuery(interaction: ChatInputCommandInteraction): {
  query: string;
  engine: SearchQueryType;
} {
  const query = interaction.options.getString("search")!;

  if (interaction.options.getSubcommand() === "file") {
    const files: string[] = getFilesRecursively(
      path.join(__dirname, "..", "..", "uploads")
    );

    const file = findBestMatch(query, files);

    return {
      query: path.join(__dirname, "..", "..", "uploads", file),
      engine: QueryType.FILE
    };
  }

  return {
    query,
    engine: QueryType.AUTO
  };
}

/**
 * Recursively goes through a directory and returns all the files in it.
 * @param root Top level directory to search.
 */
function getFilesRecursively(root: string): string[] {
  const files: string[] = [];
  const filesInDirectory = fs.readdirSync(root);

  for (const file of filesInDirectory) {
    const absolute = path.join(root, file);
    if (fs.statSync(absolute).isDirectory()) {
      files.push(...getFilesRecursively(absolute));
    } else {
      files.push(absolute);
    }
  }

  return files;
}

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
