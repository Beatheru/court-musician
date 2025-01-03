import { DiscordClient } from "@structures/discord-client";
import { GatewayIntentBits } from "discord.js";

export const client = new DiscordClient({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates]
});
