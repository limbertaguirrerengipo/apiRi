const { DataTypes, fn, BOOLEAN } = require('sequelize');
const databaseConnection = require('./dbAdministrativoFlujoConection');

exports.SorteoImagenesCobroModel = databaseConnection.define('SorteoImagenesCobroModel', {
    idSorteoImagenesCobro: {
        type: DataTypes.INTEGER,
        field:'idSorteoImagenesCobro',
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      idSorteo: {
        type: DataTypes.INTEGER,
        field:'idSorteo',
        allowNull: false,
      },
      urlImagen: {
        type: DataTypes.STRING,
        field:'urlImagen',
        allowNull: false,
      },
      extension: {
        type: DataTypes.STRING(10),
        field:'extension',
        allowNull: false,
      },
      idTipoPago: {
        type: DataTypes.INTEGER,
        field:'idTipoPago',
        allowNull: true,
      }
}, {
    tableName: 'SorteoImagenesCobro',
    timestamps: false
});
