const Discord = require("discord.js");

module.exports = {
  name: 'clear',
  description: 'Nettoie le channel',
  permission: Discord.PermissionFlagsBits.ManageMessages,
  private: false,
  category: "Modérations",
  options: [
    {
      type: "NUMBER",
      name: "nombre",
      description: "Le nombre de messages à supprimer",
      required: true
    },
    {
      type: "CHANNEL",
      name: "salon",
      description: "Le salon où effacer les messages",
      required: false
    },
  ],

  async run(client, interaction, args) {
    // je regarde si je suis en dm ou sur le serveur
    if (interaction.channel === null) {
      return interaction.reply("Cette commande ne peut pas être utilisée dans les messages privés.");
    }

    // je récupère le salon qu'il a mis
    let channel = args.getChannel("salon");
    // s'il n'a pas mis de salon
    if (!channel) channel = interaction.channel;
    if (channel.id !== interaction.channel.id && interaction.guild.channels.cache.get(channel.id) && channel === null) {
      return interaction.reply("Pas de salon trouvé");
    }

    // je regarde quel nombre il a mis
    let number = args.getNumber("nombre");
    if (parseInt(number) <= 0 || parseInt(number) > 100) {
      return interaction.reply("Mettez un nombre entre 0 et 100");
    }

    await interaction.deferReply();

    try {
      let messages = await channel.messages.fetch({ limit: parseInt(number) + 1 });
      //je regardes s'il y a des messages qui dates de plus de 14 jours
      messages = messages.filter(m => !m.interaction && (Date.now() - m.createdAt) <= 1209600000);

      if (messages.size <= 0) {
        return interaction.followUp("Aucun message à supprimer car ils datent tous de plus de 14 jours");
      }

      //je supprimes les messages
      await channel.bulkDelete(messages);

      await interaction.followUp(`J'ai bien supprimé \`${messages.size}\` messages !`);
    } catch (error) {
      await interaction.followUp("Une erreur s'est produite lors de la suppression des messages.");
    }
  },
};
