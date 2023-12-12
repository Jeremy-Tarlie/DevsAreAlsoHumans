const Discord = require("discord.js");
const { ChannelType } = require("discord.js");

module.exports = {
    name: 'delete-channel',
    description: 'Suppression d\'un salon',
    permission: Discord.PermissionFlagsBits.ManageChannels,
    private: false,
    category: "Modérations",
    options: [
        {
            type: "STRING",
            name: "salon",
            description: "Le nom du salon que vous voulez supprimez",
            required: true
        },
    ],

   
    async run(client, interaction, args) {
        //je regarde si je suis en dm ou non
        if (interaction.channel === null) {
            return interaction.reply("Cette commande ne peut pas être utilisée dans les messages privés.");
        }

        const channelId = args.getString("salon");
        const extractedChannelId = channelId.replace(/[<#>]/g, '');
        const channelToDelete = interaction.guild.channels.cache.get(extractedChannelId);

        if (channelToDelete) {
            try {
                //je supprime le channel
                await channelToDelete.delete();
                console.log(`Le canal avec l'ID ${extractedChannelId} a été supprimé avec succès.`);
            } catch (error) {
                console.error(`Une erreur s'est produite lors de la suppression du canal : ${error.message}`);
            }
        } else {
            console.error(`Le canal avec l'ID ${extractedChannelId} n'a pas été trouvé.`);
        }
    },
};
