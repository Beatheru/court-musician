import { Command } from "@models/command.model";
import config from "@utils/config";
import { checkForVoice } from "@utils/utils";
import { QueueRepeatMode, useQueue } from "discord-player";
import { Message } from "discord.js";

const command: Command = {
  name: "loop",
  description: "Set the bot to loop the current song, the queue, or none.",
  usage: `${config.prefix}loop <none | track | queue>`,
  async run(message: Message) {
    if (!checkForVoice(message)) return;

    const queue = useQueue(message.guild!.id);
    if (!queue) return;

    const loopMode = message.content.split(/\s+/)[1];

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
      default:
        if (message.channel.isSendable()) {
          message.channel.send(
            "Loop mode must be one of <none | track | queue>"
          );
        }
        break;
    }
  }
};

export default command;
