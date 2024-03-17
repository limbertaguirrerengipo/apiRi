//const databaseConfiguration = require('..')
const config = require('../src/config/database.json');
const env = process.env.NODE_ENV || 'development';
const databaseConfig = config[env];
module.exports = {
    databaseConfig
}
//export default databaseConfig;