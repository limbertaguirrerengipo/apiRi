const { DataTypes, fn, BOOLEAN } = require('sequelize');
const databaseConnection = require('./dbAdministrativoFlujoConection');

exports.TipoPagoModel = databaseConnection.define('TipoPagoModel', {
      idTipoPago: {
        type: DataTypes.INTEGER,
        field:'idTipoPago',
        primaryKey: true,
        allowNull: false,
      },
      nombre: {
        type: DataTypes.INTEGER,
        field:'nombre',
        allowNull: false,
      },
      descripcion: {
        type: DataTypes.STRING(200),
        field:'descripcion',
        allowNull: false,
      },
      urlImagen: {
        type: DataTypes.STRING(300),
        field:'urlImagen',
        allowNull: false,
      },
      estado: {
        type: DataTypes.BOOLEAN,
        field:'estado',
        allowNull: true,
      }
}, {
    tableName: 'TipoPago',
    timestamps: false
});
