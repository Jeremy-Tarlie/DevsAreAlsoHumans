const Discord = require("discord.js");

module.exports = {
    name: 'help',
    description: 'Affiche les commandes',
    permission: "Aucune",
    private: true,
    category: "Informations",
    options: [
        {
            type: "string",
            name: "commande",
            description: "La commande à affichier",
            required: false
        }
    ],

    async run(client, message, args) {
        let command;
        if (args.getString("commande")) {
            command = client.commands.get(args.getString("commande"));
            if (!command) return message.reply("Pas de commande !");
        }

        if (!command) {
            let categories = [];
            client.commands.forEach(command => {
                if (!categories.includes(command.category)) {
                    categories.push(command.category);
                }
            });

            //je construit l'inventaire des commandes
            let Embed = new Discord.EmbedBuilder()
                .setColor(client.color)
                .setTitle("Commandes du bot")
                .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
                .setDescription(`Commandes disponibles : ${client.commands.size}\nCatégories disponibles : ${categories.length}`)
                .setTimestamp()
                .setFooter({ text: "Commandes du robot" });

            //je trie par category de commande
            await categories.sort().forEach(async cat => {
                let commandsArray = Array.from(client.commands.values());
                let commands = commandsArray.filter(cmd => cmd.category === cat);
                Embed.addFields({ name: `${cat}`, value: `${commands.map(cmd => `\`${cmd.name}\` :  ${cmd.description}`).join("\n")}` });
            });

            await message.reply({ embeds: [Embed] });
        } else {
            //je construit le details de la commande
            let Embed = new Discord.EmbedBuilder()
                .setColor(client.color)
                .setTitle(`Commandes du ${command.name}`)
                .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
                .setDescription(`Nom : \`${command.name}\`\nDescription : \`${command.description}\`\nPermission requise : \`${typeof command.permission !== "bigint" ? command.permission : new Discord.PermissionsBitField(command.permission).toArray(false)}\`\nCommande en DM : \`${command.private ? "Oui" : "Non"}\`\nCatégorie : \`${command.category}\``)
                .setTimestamp()
                .setFooter({ text: "Commandes du robot" });

            await message.reply({ embeds: [Embed] });
        }
    },
};
