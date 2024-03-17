const { DataTypes, fn } = require('sequelize');
const databaseConnection = require('./dbAdministrativoFlujoConection');

exports.SorteoModel = databaseConnection.define('SorteoModel', {
      idSorteo: {
        type: DataTypes.INTEGER,
        field:'idSorteo',
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      titulo: {
        type: DataTypes.STRING(50),
        field:'titulo',
        allowNull: false,
      },
      cantidadTicket: {
        type: DataTypes.BIGINT,
        field:'cantidadTicket',
        allowNull: false,
      },
      precioUnitario: {
        type: DataTypes.DECIMAL,
        field:'precioUnitario',
        allowNull: false,
      },
      linkReservas: {
        type: DataTypes.STRING,
        field:'linkReservas',
        allowNull: true,
      },
      fechaSorteo: {
        type: DataTypes.DATE,
        field:'fechaSorteo',
        allowNull: true,
      },
      idMoneda: {
        type: DataTypes.INTEGER,
        field:'idMoneda',
        allowNull: true,
      },
      descripcion: {
        type: DataTypes.STRING,
        field:'descripcion',
        allowNull: false,
      },
      estado: {
        type: DataTypes.INTEGER,
        field:'estado',
        allowNull: true,
      },
      fechaCreacion: {
        type: DataTypes.DATE,
        field:'fechaCreacion',
        allowNull: false,
      },
      fechaModificacion: {
        type: DataTypes.DATE,
        field:'fechaModificacion',
        allowNull: false,
      },
      usuarioCreacion: {
        type: DataTypes.STRING(50),
        field:'usuarioCreacion',
        allowNull: false,
      },
      usuarioModificacion: {
        type: DataTypes.STRING(50),
        field:'usuarioModificacion',
        allowNull: false,
      },
}, {
    tableName: 'Sorteo',
    timestamps: false
});
