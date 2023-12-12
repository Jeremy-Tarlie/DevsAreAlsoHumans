const fs = require("fs");
const path = require("path");

module.exports = (client) => {
    try {
        const eventsFiles = fs
            .readdirSync(path.resolve(__dirname, "../Events"))
            .filter((file) => file.endsWith(".js"));

        for (const file of eventsFiles) {
            const eventName = file.split(".js")[0];
            const event = require(path.resolve(__dirname, "../Events", file));

            client.on(eventName, event.bind(null, client));
        }
    } catch (error) {
        console.error("Error loading events:", error);
    }
};
