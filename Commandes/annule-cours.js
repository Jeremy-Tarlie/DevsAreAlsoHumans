const { ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const Discord = require('discord.js');

module.exports = {
  name: 'annule-cours',
  description: 'Annule un cours',
  permission: "Aucune",
  private: true,
  category: 'Informations',
  options: [ //c'est pour que les utilisateurs complete la commande
    {
      type: 'STRING',
      name: 'id_cours',
      description: 'Marquez l\'ID du cours',
      required: true,
    }
  ],

  async run(client, interaction, args) {
    try {
      // je recupère l'id du cours que l'utilisateur à mis
      const coursIDCours = args.getString('id_cours');
      const idUser = interaction.user.id

      // je regarde s'il y a mis un id
      if (!coursIDCours) {
        return interaction.reply('L\'ID du cours est manquant ou invalide.');
      }

      // je le désinscrit à ce cours
      const [rows, fields] = await client.db.execute(
        `DELETE from participant WHERE id_cours = ? AND id_user = ?`,
        [coursIDCours, idUser]
      );

      if (rows.length === 0) {
        return interaction.reply('Une erreur est survenue.');
      }

      if (rows.length === undefined) {
        return interaction.reply('Vous ne faites pas partie de ce cours.');
      }

      // j'envoie un message de succes pour l'annulation
      await interaction.reply(`Vous avez bien été supprimer de la liste pour le cours n°${coursIDCours}`);
    } catch (error) {
      console.error(`Une erreur s'est produite lors de l'annonce : ${error.message}`);
      interaction.reply("Une erreur s'est produite lors de la participation.");
    }
  },
};

