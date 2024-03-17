const { Sequelize } = require('sequelize');

exports.getDatabaseConnection = (databaseConfiguration) => {
    return new Sequelize(databaseConfiguration.databaseName, databaseConfiguration.username, databaseConfiguration.password, {
        host: databaseConfiguration.host,
        dialect: databaseConfiguration.dialect,
        dialectOptions: databaseConfiguration.dialectOptions
    });
};
