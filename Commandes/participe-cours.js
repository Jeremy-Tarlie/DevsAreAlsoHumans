const { ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const Discord = require('discord.js');

module.exports = {
  name: 'participe-cours',
  description: 'Participe à un cours',
  permission: "Aucune",
  private: true,
  category: 'Informations',
  options: [
    {
      type: 'STRING',
      name: 'id_cours',
      description: 'Marquez l\'ID du cours',
      required: true,
    },
    {
      type: 'STRING',
      name: 'last_name',
      description: 'Mettez votre nom',
      required: true,
    },
    {
      type: 'STRING',
      name: 'first_name',
      description: 'Mettez votre nom',
      required: true,
    },
    {
      type: 'STRING',
      name: 'mail',
      description: 'Mettez votre email',
      required: true,
    }
  ],

  async run(client, interaction, args) {
    try {
      
      const coursIDCours = args.getString('id_cours');
      const coursLastName = args.getString('last_name')
      const coursFirstName = args.getString('first_name')
      const coursMail = args.getString('mail')
      const coursID = args.getUser('user') ? args.getUser('user').id : interaction.user.id;

      if (!coursIDCours) {
        return interaction.reply('L\'ID du cours est manquant ou invalide.');
      }

      if (!coursLastName) {
        return interaction.reply('Le nom est manquant ou invalide.');
      }

      if (!coursFirstName) {
        return interaction.reply('Le prénom est manquant ou invalide.');
      }

      if (!coursMail || !estEmailValide(coursMail)) {
        return interaction.reply('Le mail est manquant ou invalide.');
      }

      const [rows, fields] = await client.db.execute(
        `INSERT INTO participant(id_user, id_cours, first_name, last_name, email) VALUES (?,?,?,?,?)`,
        [coursID, coursIDCours, coursFirstName, coursLastName, coursMail]
      );

      await interaction.reply('L\'inscription pour le cours est validée.');
    } catch (error) {
      console.error(`Une erreur s'est produite lors de l'annonce : ${error.message}`);
      interaction.reply("Une erreur s'est produite lors de la participation.");
    }
  },
};


function estEmailValide(email) {
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regexEmail.test(email);
  }
  