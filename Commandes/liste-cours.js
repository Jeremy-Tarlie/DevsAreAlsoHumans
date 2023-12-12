const { ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const Discord = require('discord.js');

module.exports = {
  name: 'liste-cours',
  description: 'Liste des cours que tu participes',
  permission: "Aucune",
  private: true,
  category: 'Informations',

  async run(client, interaction, args) {
    try {
      const idUser = interaction.user.id;

      
      const [rows, fields] = await client.db.execute(
        `SELECT id_cours FROM participant WHERE id_user = ?`,
        [idUser]
      );

      
      if (rows.length === 0) {
        return interaction.reply('Tu ne participes à aucun cours.');
      }

      
      const cours = await Promise.all(
        rows.map(async row => {
            
          const [rows2, fields2] = await client.db.execute(
            `SELECT * FROM cours WHERE coursID = ?`,
            [row.id_cours]
          );
          return rows2[0];
        })
      );

      
      const embed = new Discord.EmbedBuilder()
        .setColor(client.color)
        .setTitle(`Liste des cours où tu participes`)
        .setDescription(
          cours.map(cours => `* Cours n°${cours.coursID} - ${convertisseurDate(cours.dateCours)}`)
            .join('\n')
        )
        .setTimestamp()
        .setFooter({ text: 'Liste des personnes inscrites.' });

      
      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(`Une erreur s'est produite lors de l'annonce : ${error.message}`);
      console.error(error);
      interaction.reply('Une erreur s\'est produite lors de l\'annonce.');
    }
  },
};

function convertisseurDate(dateAConvertir) {
  const dateOriginale = new Date(dateAConvertir);

  const options = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: false, 
    timeZone: 'Europe/Paris' 
  };

  const dateFormatee = dateOriginale.toLocaleDateString('fr-FR', options);

  return dateFormatee;
}
