import config from "@utils/config";
import { Player } from "discord-player";
import { YoutubeiExtractor } from "discord-player-youtubei";
import { Client, ClientOptions, Collection, Events } from "discord.js";
import fs from "fs";
import { Command } from "models/command.model";
import path from "path";

export class DiscordClient extends Client {
  // List of commands.
  public commands: Collection<string, Command> = new Collection();

  constructor(options: ClientOptions) {
    super(options);

    // Check if the token is set in the env file.
    if (!config.token) throw new Error("Add a token to the env file.");

    // Login the discord bot.
    this.login(config.token);

    // Creates new discord-player instance.
    const player = new Player(this);
    player.extractors.loadDefault((ext) => ext !== "YouTubeExtractor");
    player.extractors.register(YoutubeiExtractor, {});

    // Register commands and events.
    this.registerCommands();
    this.registerClientEvents();
    this.registerPlayerEvents(player);
  }

  /**
   * Register all commands in the commands folder.
   */
  private async registerCommands() {
    const commandsPath = path.join(__dirname, "..", "commands");
    const commandFiles = fs
      .readdirSync(commandsPath)
      .filter((file) => /.[jt]s$/.test(file));

    for (const file of commandFiles) {
      const filePath = path.join(commandsPath, file);
      const command = await import(filePath);
      this.commands.set(command.default.name, command.default);
    }
  }

  // Registers events for the Discord client.
  private registerClientEvents() {
    this.once(Events.ClientReady, () => {
      console.log("Bot ready!");
    });

    // Command handler for messages.
    this.on(Events.MessageCreate, async (message) => {
      if (message.content.startsWith(config.prefix)) {
        const commandName = message.content
          .split(/\s+/)[0]
          .toLowerCase()
          .substring(1);

        const command = this.commands.get(commandName);
        if (!command) {
          message.channel.send(
            `No command matching "${commandName}" was found.`
          );

          return;
        }

        // Delete the message if it is not an upload command.
        // Upload message needs to be kept in order to download the file.
        if (command.name !== "upload") {
          message.delete();
        }

        await command.run(message);
      }
    });
  }

  private registerPlayerEvents(player: Player) {
    // Player events
    player.events.on("playerStart", (queue, track) => {
      // Emitted when the player starts to play a song
      console.log(`Playing "${track.title}" by ${track.author}`);
    });

    player.events.on("audioTrackAdd", (queue, track) => {
      // Emitted when the player adds a single song to its queue
      console.log(
        `Queued "${track.title}" by ${track.author} - ${
          track.duration
        } from ${track.raw.source?.toUpperCase()} `
      );
    });

    player.events.on("audioTracksAdd", (queue) => {
      // Emitted when the player adds multiple songs to its queue
      queue.tracks.toArray().forEach((t) => {
        console.log(
          `Queued "${t.title}" by ${t.author} - ${
            t.duration
          } from ${t.raw.source?.toUpperCase()} `
        );
      });
    });

    // Error events
    player.events.on("error", (queue, error) => {
      // Emitted when the player queue encounters error
      console.log(`General player error event: ${error.message}`);
    });

    player.events.on("playerError", (queue, error) => {
      // Emitted when the audio player errors while streaming audio track
      console.log(`Player error event: ${error.message}`);
    });

    // Log debug logs of the queue, such as voice connection logs, player execution, streaming process etc.
    if (process.env.NODE_ENV === "development") {
      player.events.on("debug", (queue, message) => console.log(`${message}`));
    }
  }
}
