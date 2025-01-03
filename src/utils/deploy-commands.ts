import { REST, Routes } from "discord.js";
import fs from "fs";
import path from "path";
import config from "@utils/config";

/**
 * Deploys commands to all servers.
 */
async function deployCommands() {
  const commands = [];
  const commandsPath = path.join(__dirname, "..", "commands");
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => /.[jt]s$/.test(file));

  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = await import(filePath);
    commands.push(command.default.data.toJSON());
  }

  const rest = new REST().setToken(config.token);
  try {
    console.log(`Started deploying ${commands.length} commands.`);

    await rest.put(Routes.applicationCommands(config.clientId), {
      body: commands
    });

    console.log(`Successfully deployed commands.`);
  } catch (error) {
    console.error(error);
  }
}

deployCommands();
