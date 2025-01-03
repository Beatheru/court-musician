import { Command } from "@models/command.model";
import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import download from "download";
import fs from "fs";
import path from "path";

const extensions = [".mp3", "mp4", ".webm", ".ogg"];

/**
 * Checks if the file extension is one of the accepted extensions.
 * @param file File name.
 */
function checkFileType(file: string): boolean {
  const ext = path.extname(file).toLowerCase();
  return extensions.includes(ext);
}

export default {
  data: new SlashCommandBuilder()
    .setName("upload")
    .setDescription(
      `Upload a file to the server. Play with the "play" command.`
    )
    .addAttachmentOption((option) =>
      option
        .setName("file")
        .setDescription(
          `Accepts the following file types: ${extensions.join(", ")}.`
        )
        .setRequired(true)
    ),
  async run(interaction: ChatInputCommandInteraction) {
    const file = interaction.options.getAttachment("file")!;

    if (!checkFileType(file.name)) {
      return;
    }

    await interaction.deferReply({ ephemeral: true });

    const filePath = path.join(__dirname, "..", "..", "uploads");
    if (fs.existsSync(path.join(filePath, file.name))) {
      console.log("File exists");
      await interaction.editReply("File already exists.");

      return;
    }

    await download(file.url, filePath);
    console.log("Download complete");
    await interaction.editReply("File uploaded successfully.");
  }
} as Command;
