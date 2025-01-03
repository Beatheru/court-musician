import { GuildMember, Interaction } from "discord.js";

/**
 * Helper function to check if a user is in a voice channel.
 * @param message Message that the user sent in a text channel.
 * @returns True if the user is in a voice channel, false otherwise.
 */
export function checkForVoice(interaction: Interaction): boolean {
  const voiceChannel = (interaction.member as GuildMember).voice.channel;
  if (!voiceChannel) {
    if (interaction.isRepliable()) {
      interaction.reply({
        content: "You must be in a voice channel to use this command!",
        ephemeral: true
      });
    }

    return false;
  }

  return true;
}

/**
 * String comparison function to get the similarity between two strings.
 * Implements Dice's Coefficient.
 * @returns A number between 0 and 1, where 0 means no similarity and 1 means the strings are identical.
 */
export function compareStrings(str1: string, str2: string): number {
  const bigrams1 = new Set();
  const bigrams2 = new Set();

  for (let i = 0; i < str1.length - 1; i++) {
    bigrams1.add(str1.substring(i, i + 2));
  }

  for (let i = 0; i < str2.length - 1; i++) {
    bigrams2.add(str2.substring(i, i + 2));
  }

  const intersection = new Set([...bigrams1].filter((x) => bigrams2.has(x)));

  return (2 * intersection.size) / (bigrams1.size + bigrams2.size);
}

/**
 * Finds the string in a list of strings that is most similar to the input string.
 * @param input String to compare to.
 * @param targetStrings List of strings to compare input string to.
 * @returns The string that is the most similar to the input string.
 */
export function findBestMatch(input: string, targetStrings: string[]): string {
  let bestMatch = {
    score: 0,
    string: ""
  };

  targetStrings.forEach((targetString) => {
    const score = compareStrings(input, targetString);
    if (score > bestMatch.score) {
      bestMatch = {
        score,
        string: targetString
      };
    }
  });

  return bestMatch.string;
}
