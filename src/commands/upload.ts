import { Command } from "@models/command.model";
import config from "@utils/config";
import { Message } from "discord.js";
import download from "download";
import fs from "fs";
import path from "path";

const extensions = [".mp3", "mp4", ".webm", ".ogg"];

const command: Command = {
  name: "upload",
  description: `Upload a file to the server. To play the file use the play command with the file search engine as so "${config.prefix}play $file <search>". Will delete the message after upload completes. Accepts the following file types: ${extensions.join(", ")}.`,
  usage: `${config.prefix}upload`,
  async run(message: Message) {
    const file = message.attachments?.first();
    if (!file) {
      return;
    }

    if (!checkFileType(file.name)) {
      message.delete();

      return;
    }

    const filePath = path.join(__dirname, "..", "..", "uploads");
    if (fs.existsSync(path.join(filePath, file.name))) {
      console.log("File exists");
      message.delete();

      return;
    }

    await download(file.url, filePath);
    console.log("Download complete");
    message.delete();
  }
};

/**
 * Checks if the file extension is one of the accepted extensions.
 * @param file File name.
 */
function checkFileType(file: string): boolean {
  const ext = path.extname(file).toLowerCase();
  return extensions.includes(ext);
}

export default command;
