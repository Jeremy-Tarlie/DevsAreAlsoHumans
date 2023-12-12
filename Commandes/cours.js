const { ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const Discord = require('discord.js');

module.exports = {
  name: 'cours',
  description: 'Annonce d\'un cours',
  permission: Discord.PermissionFlagsBits.ManageMessages,
  private: false,
  category: 'Informations',
  options: [
    {
      type: 'STRING',
      name: 'detail',
      description: 'Marquez le détail du cours',
      required: true,
    },
    {
      type: 'USER',
      name: 'professeur',
      description: 'Mentionner le professeur du cours',
      required: true,
    },
    {
      type: 'STRING',
      name: 'date',
      description: 'Date et heure du cours, en format dd/mm/aaaa hh:mm',
      required: true,
    }
  ],

  async run(client, interaction, args) {
    try {
        //je regarde si je suis en mp
        if (interaction.channel === null) {
          return interaction.reply("Cette commande ne peut pas être utilisée dans les messages privés.");
        }

        //je fais une mention everyone 
        await interaction.channel.send('@everyone');

        const coursDetail = args.getString('detail');
        const coursUser = args.getUser('professeur')
        const coursDate = args.getString('date')

        if (!coursDetail) {
          return interaction.reply('Le détail du cours est manquant ou invalide.');
        }

        if (!coursUser) {
          return interaction.reply('Le professeur du cours est manquant ou invalide.');
        }

        if (!coursDate || typeof coursDate !== 'string') {
          return interaction.reply('La date du cours est manquante ou invalide.');
        }

        const dateAuFormatSQL = convertirFormatSQL(`${coursDate}`);
        const dateFournie = new Date(dateAuFormatSQL);
        const dateActuelle = new Date();

        if (dateFournie < dateActuelle) {
          return interaction.reply('La date et l\'heure du cours doivent être ultérieures à la date actuelle.');
        }

        //je met dans la base de donnée le cours
        const [rows, fields] = await client.db.execute(
          `INSERT INTO cours (detail, dateCours, userID) VALUES (?, ?, ?)`,
          [coursDetail, dateAuFormatSQL, coursUser.id]
        );

        const coursID = rows.insertId;

        //je construit l'annonce
        const embed = new Discord.EmbedBuilder()
          .setColor(client.color)
          .setTitle(`Annonce d'un cours - ID ${coursID}`)
          .setDescription(`${coursDetail}\n\nLe cours aura lieu le ${coursDate}\n\nPour participer faites /participe-cours ${coursID} nom prenom email\nPour ne plus participer faites /annule-cours ${coursID}`)
          .setTimestamp()
          .setFooter({ text: 'Cours mise en ligne' });

        //je met l'annonce en ligne
        await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(`Une erreur s'est produite lors de l'annonce : ${error.message}`);
      interaction.reply("Une erreur s'est produite lors de l'annonce.");
    }
  },
};



// je converti la date dd/mm/aaaa hh:mm en aaaa-mm-dd hh:mm:00
function convertirFormatSQL(dateStr) {
  // Séparer la date et l'heure
  const [datePart, timePart] = dateStr.split(' ');

  // Séparer le jour, le mois et l'année
  const [jour, mois, annee] = datePart.split('/');

  // Séparer les heures, minutes
  const [heure, minute] = timePart.split(':');

  // Créer un objet Date avec le nouveau format
  const nouvelleDate = new Date(`${annee}-${mois}-${jour} ${heure}:${minute}:00Z`);

  // Formater la date avec le format SQL
  const formatSQL = nouvelleDate.toISOString().slice(0, 19).replace("T", " ");

  return formatSQL;
}


