const Discord = require("discord.js");
const loadSlashCommands = require("../Loader/loadSlashCommands");
const loadDataBase = require("../Loader/loadDataBase");

module.exports = async (client) => {
    try {
        client.db = await loadDataBase();

        await loadSlashCommands(client);
    } catch (error) {
        console.error("Erreur lors de la connexion à la base de données:", error.message);
        throw error;
    }
};
