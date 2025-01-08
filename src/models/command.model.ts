import {
  AutocompleteInteraction,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  SlashCommandOptionsOnlyBuilder,
  SlashCommandSubcommandBuilder,
  SlashCommandSubcommandGroupBuilder,
  SlashCommandSubcommandsOnlyBuilder
} from "discord.js";

export interface Command {
  data:
    | SlashCommandBuilder
    | SlashCommandSubcommandBuilder
    | SlashCommandOptionsOnlyBuilder
    | SlashCommandSubcommandsOnlyBuilder
    | SlashCommandSubcommandGroupBuilder;
  run(interaction: ChatInputCommandInteraction): Promise<void>;
  autocomplete(interaction: AutocompleteInteraction): Promise<void>;
}
