const fs = require("fs");
const path = require("path");

module.exports = (client) => {
    try {
        const commandFiles = fs
            .readdirSync(path.resolve(__dirname, "../Commandes"))
            .filter((file) => file.endsWith(".js"));

        for (const file of commandFiles) {
            const command = require(path.resolve(__dirname, "../Commandes", file));

            client.commands.set(command.name, command);
        }
    } catch (error) {
        console.error("Error loading commands:", error);
    }
};
