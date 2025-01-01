import config from "@utils/config";
import { checkForVoice, findBestMatch } from "@utils/utils";
import {
  QueryType,
  SearchQueryType,
  SearchResult,
  Track,
  useMainPlayer,
  useQueue
} from "discord-player";
import { Message } from "discord.js";
import fs from "fs";
import { Args, Command } from "models/command.model";
import path from "path";

// @TODO: Refactor this to not have the additionalArgs parameter. Also possibly separate the file search into a new command.
const command: Command = {
  name: "play",
  description: `Search for a song to play or use a url. Optionally specify the search engine. Supports "youtube", "spotify", "soundcloud", and "file" for uploaded files.`,
  usage: `${config.prefix}play <url or search term> $<search engine>`,
  async run(message: Message, additionalArgs: Args) {
    if (!checkForVoice(message)) return;

    const args = message.content.split("$");
    const engine = args[1]
      ? (findBestMatch(args[1], Object.values(QueryType)) as SearchQueryType)
      : "auto";
    let query = args[0].split(/\s+/).slice(1).join(" ");

    if (engine === QueryType.FILE) {
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
        console.log("No results found");
        if (message.channel.isSendable()) {
          message.channel.send("No results found");
        }
        return;
      }

      query = path.join(__dirname, "..", "..", "uploads", file);
    }

    const player = useMainPlayer();
    const search = await player.search(query, {
      searchEngine: engine
    });
    if (search.isEmpty()) {
      if (message.channel.isSendable()) {
        message.channel.send("No results found");
      }

      return;
    }

    const result = parseSearchResult(search, query);

    const queue = useQueue(message.guild!.id);
    if (queue?.node.isPlaying() && additionalArgs?.top) {
      if (result instanceof SearchResult) {
        result.tracks.forEach((track) => {
          queue?.insertTrack(track, 0);
        });
      } else if (result instanceof Track) {
        queue?.insertTrack(result, 0);
      }

      return;
    }

    // @TODO: Remove this.
    // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
    await player.play(message.member?.voice.channel!, result, {
      nodeOptions: {
        volume: 15
      },
      connectionOptions: {
        deaf: false
      }
    });
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
