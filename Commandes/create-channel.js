// commands/channel.js
const Discord = require("discord.js");
const { ChannelType } = require("discord.js");

module.exports = {
    name: 'create-channel',
    description: 'Crée un nouveau salon',
    permission: Discord.PermissionFlagsBits.ManageChannels,
    private: false,
    category: "Modérations",
    options: [
        {
            type: "STRING",
            name: "nom",
            description: "Le nom du nouveau salon",
            required: true
        },
        {
            type: "STRING",
            name: "category",
            description: "Dans quelle catégorie il va être créé",
            required: true
        },
    ],

    async run(client, interaction, args) {
        //je regarde si je suis en dm ou non
        if (interaction.channel === null) {
            return interaction.reply("Cette commande ne peut pas être utilisée dans les messages privés.");
        }

        const channelName = args.getString("nom");
        const categoryName = args.getString("category");

        if (!channelName) {
            return interaction.reply("Le nom du salon est manquant ou invalide.");
        }

        if (!categoryName) {
            return interaction.reply("Le nom de la catégorie est invalide.");
        }

        try {
            //je regarde si la category que l'utilisateur a mis existe
            const category = interaction.guild.channels.cache.find((c) => c.type === 4 && c.name === categoryName);

            if (!category) {
                return interaction.reply("La catégorie spécifiée n'a pas été trouvée.");
            }

            //je créer le nouveau channel text
            const newChannel = await interaction.guild.channels.create({
                name: channelName,
                type: ChannelType.GuildText,
                parent: category.id,
            });

            interaction.reply(`Le salon "${newChannel.name}" a été créé avec succès dans la catégorie "${category.name}"!`);
        } catch (error) {

            interaction.reply("Une erreur s'est produite lors de la création du salon.");
        }
    },
};
