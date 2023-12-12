const { ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const Discord = require('discord.js');

module.exports = {
  name: 'mission',
  description: 'Annonce d\'une mission',
  permission: Discord.PermissionFlagsBits.ManageMessages,
  private: false,
  category: 'Informations',
  options: [
    {
      type: 'STRING',
      name: 'detail',
      description: 'Marquez le détail de la mission',
      required: true,
    },
  ],

  async run(client, interaction, args) {
    try {
      if (interaction.channel === null) {
        return interaction.reply("Cette commande ne peut pas être utilisée dans les messages privés.");
      }
      
      await interaction.channel.send('@everyone');

      const missionDetail = args.getString('detail');
      
      if (!missionDetail) {
        return interaction.reply('Le détail de la mission est manquant ou invalide.');
      }
      
      const row = new ActionRowBuilder();
      const selectMenu = new StringSelectMenuBuilder()
        .setCustomId('missionOptions')
        .setPlaceholder('Choisissez une option...')
        .addOptions([
          { label: 'Mission prise par une personne', value: 'option1' },
          { label: 'Mission annulée', value: 'option2' },
        ]);

      row.addComponents(selectMenu);

      const embed = new Discord.EmbedBuilder()
        .setColor(client.color)
        .setTitle(`Mission annoncée`)
        .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
        .setDescription(`${missionDetail}`)
        .setTimestamp()
        .setFooter({ text: 'Mission mise en ligne' });

      const initialReply = await interaction.reply({ embeds: [embed], components: [row] });
      const isDeferred = initialReply.deferred;
      const filter = (interaction) => {
        return interaction.isStringSelectMenu() && interaction.customId === 'missionOptions';
      };

      const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });

      collector.on('collect', async (interaction) => {
        try {
      
          if (!isDeferred) {
            await interaction.deferUpdate();
          }

          const selectedValue = interaction.values[0];
     
          let hasPermissionInteraction = interaction.member.permissions.has([Discord.PermissionFlagsBits.ManageMessages])
          hasPermissionInteraction = hasPermissionInteraction ? true : false;

          if (selectedValue === 'option1') {
            if (hasPermissionInteraction) {
              embed.setColor("#00FF00").setTitle("Mission prise par une personne");
              await interaction.editReply({ embeds: [embed], components: [] });
            } else {
              await interaction.followUp({ content: 'Vous n\'avez pas les autorisations nécessaires.', ephemeral: true });
            }
          } else if (selectedValue === 'option2') {
            if (hasPermissionInteraction) {
              embed.setColor("#ff0000").setTitle("Mission annulée");
              await interaction.editReply({ embeds: [embed], components: [] });
            } else {
              await interaction.followUp({ content: 'Vous n\'avez pas les autorisations nécessaires.', ephemeral: true });
            }
          }
        } catch (error) {
          console.error(`Une erreur s'est produite lors de la gestion de l'interaction : ${error.message}`);
        }
      });

      collector.on('end', () => {
      });
    } catch (error) {
      console.error(`Une erreur s'est produite lors de l'annonce : ${error.message}`);
      interaction.reply("Une erreur s'est produite lors de l'annonce.");
    }
  },
};
