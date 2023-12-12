const { ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const Discord = require('discord.js');

module.exports = {
  name: 'liste-participant-cours',
  description: 'Liste des participants à un cours',
  permission: "Aucune",
  private: true,
  category: 'Informations',
  options: [
    {
      type: 'STRING',
      name: 'id_cours',
      description: 'Marquez l\'ID du cours',
      required: true,
    }
  ],

  async run(client, interaction, args) {
    try {
      const coursIDCours = args.getString('id_cours');

      if (!coursIDCours) {
        return interaction.reply('L\'ID du cours est manquant ou invalide.');
      }

      const [rows, fields] = await client.db.execute(
        `SELECT * from participant WHERE id_cours = ?`,
        [coursIDCours]
      );

      if (rows.length === 0) {
        return interaction.reply('Aucun participant trouvé pour cet ID de cours.');
      }
   
      const participants = rows.map(row => `${row.first_name} ${row.last_name} - ${row.email}`);
      const embed = new Discord.EmbedBuilder()
        .setColor(client.color)
        .setTitle(`Liste des personnes du cours - ID ${coursIDCours}`)
        .setDescription(`* ${participants.join('\n')}`)
        .setTimestamp()
        .setFooter({ text: 'Liste des personnes inscrites.' });

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(`Une erreur s'est produite lors de l'annonce : ${error.message}`);
      interaction.reply("Une erreur s'est produite lors de la participation.");
    }
  },
};

