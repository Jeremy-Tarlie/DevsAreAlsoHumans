const { REST } = require("discord.js");
const { Routes } = require("discord.js");

module.exports = async (client) => {

  const commands = [];

  client.commands.forEach(async (command) => {
    const slashCommand = new client.SlashCommandBuilder()
      .setName(command.name)
      .setDescription(command.description);

    if (command.options?.length >= 1) {
      for (const option of command.options) {
        if (option.type.toLowerCase() === "channel") {
          slashCommand.addChannelOption((optionBuilder) =>
            optionBuilder
              .setName(option.name)
              .setDescription(option.description)
              .setRequired(option.required)
          );
        } else {
          const optionType = option.type.toLowerCase();
          const addOptionMethod = `add${optionType.charAt(0).toUpperCase()}${optionType.slice(1)}Option`;

          if (slashCommand[addOptionMethod]) {
            slashCommand[addOptionMethod]((optionBuilder) =>
              optionBuilder
                .setName(option.name)
                .setDescription(option.description)
                .setRequired(option.required)
            );
          } else {
            console.error(`Type d'option non pris en charge : ${optionType}`);
          }
        }
      }
    }

    commands.push(slashCommand.toJSON());
  });

  const rest = new REST({ version: "10" }).setToken(client.token);

  try {
    await rest.put(Routes.applicationCommands(client.user.id), { body: commands });
  } catch (error) {
    console.error(error);
  }
};