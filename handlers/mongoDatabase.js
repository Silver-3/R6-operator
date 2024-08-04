const { Database } = require('quickmongo');

module.exports = async (mongoURL) => {
    const db = new Database(mongoURL);

    await db.connect();

    db.on('ready', () => {
        console.log('Connected to the database');
    });

    return db;
};
