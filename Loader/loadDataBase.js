const mysql = require('mysql2/promise');

module.exports = async () => {
    try {
        const db = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'DevsAreAlsoHumans'
        });

        console.log('Base de données connectée');
        return db;
    } catch (error) {
        console.error(`Erreur lors de la connexion à la base de données : ${error.message}`);
        throw error;  
    }
};
