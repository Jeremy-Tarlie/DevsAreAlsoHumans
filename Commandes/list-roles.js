const { MessageEmbed } = require("discord.js");
const Discord = require("discord.js");
const { ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');

module.exports = {
    name: 'list-roles',
    description: 'Liste les rôles du serveur',
    permission: Discord.PermissionFlagsBits.ManageRoles,
    private: false,
    category: "Modérations",
    options: [
        {
            type: 'STRING',
            name: 'roles',
            description: 'Mettez les roles que vous voulez',
            required: true,
        },
    ],


    async run(client, interaction, args) {
        //je regarde si je suis en dm ou non
        if (interaction.channel === null) {
            return interaction.reply("Cette commande ne peut pas être utilisée dans les messages privés.");
          }

        const rolesInput = interaction.options.getString('roles');
        const roleMentions = rolesInput.match(/<@&(\d+)>/g);

        if (!roleMentions) {
            return interaction.reply("Aucun rôle mentionné.");
        }

        const mentionedRoles = roleMentions.map(mention => {
            const roleId = mention.match(/<@&(\d+)>/)[1];
            return interaction.guild.roles.cache.get(roleId);
        });
        const filteredRoles = mentionedRoles.filter(role => role);
        const roleList = filteredRoles.map(role => `**${role.name}**: \`${role.id}\``);
        const options = filteredRoles.map(role => ({
            label: role.name,
            value: role.id
        }));
        //je construit les choix de l'annonce
        const row = new ActionRowBuilder();
        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId('missionOptions')
            .setPlaceholder('Choisissez une option...')
            .addOptions(options);

        row.addComponents(selectMenu);

        //je construit l'annonce
        const embed = new Discord.EmbedBuilder()
            .setTitle('Liste des rôles du serveur')
            .setDescription(`Choisissez votre rôle :\n`)
            .setColor('#3498db')
            .setTimestamp()
            .setFooter({ text: 'Mission mise en ligne' });

        await interaction.reply({ embeds: [embed], components: [row] });

        client.on('interactionCreate', async (interaction) => {
            if (!interaction.isStringSelectMenu()) return;

            if (interaction.customId === 'missionOptions') {
                if (!client.isReady()) {
                    return interaction.reply("Le bot n'est pas encore complètement connecté au serveur. Veuillez réessayer plus tard.");
                }
                
                if (!interaction.guild) {
                    return interaction.reply("Cette commande n'est pas disponible en messages privés.");
                }

                const selectedRoleId = interaction.values[0];
                const selectedRole = interaction.guild.roles.cache.get(selectedRoleId);

                if (selectedRole) {
                    try {
                        if (interaction.guild) {
                            const botHighestRole = interaction.guild.roles.highest;
                            
                            if (selectedRole.position > botHighestRole.position) {
                                return interaction.reply("Le rôle sélectionné est supérieur à mon rôle le plus élevé.");
                            }
                                                        
                            await interaction.member.roles.add(selectedRole);
                            await interaction.reply(`Vous avez maintenant le rôle ${selectedRole.name} !`);
                        } else {
                            console.error("Le bot n'est pas encore complètement connecté au serveur.");
                        }
                    } catch (error) {
                        console.error(`Une erreur s'est produite lors de l'ajout du rôle : ${error.message}`);
                    }
                } else {
                    console.error(`Le rôle avec l'ID ${selectedRoleId} n'a pas été trouvé.`);
                }
            }
        });

    },
};
