//aqui va la conexion de la bd comisiones
const dataBaseConfig = require('../../database');
const databaseService = require('../../services/databaseService');
let databaseConfiguration =  dataBaseConfig.databaseConfig.administrativo;
databaseConfiguration.databaseName = dataBaseConfig.databaseConfig.nombre_base_dato.administrativo_flujo;
const connection = databaseService.getDatabaseConnection(databaseConfiguration);
module.exports = connection;