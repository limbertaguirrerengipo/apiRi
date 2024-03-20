const { DataTypes, fn } = require('sequelize');
const databaseConnection = require('./dbAdministrativoFlujoConection');

exports.ClienteTemporalModel = databaseConnection.define('ClienteTemporalModel', {
     idClienteTemporal: {
        type: DataTypes.INTEGER,
        field:'idClienteTemporal',
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      carnetIdentidad: {
        type: DataTypes.STRING(200),
        field:'carnetIdentidad',
        allowNull: false,
      },
      nombreCompleto: {
        type: DataTypes.STRING(100),
        field:'nombreCompleto',
        allowNull: false,
      },
      codePais: {
        type: DataTypes.STRING(30),
        field:'codePais',
        allowNull: false,
      },
      nroCelular: {
        type: DataTypes.STRING,
        field:'nroCelular',
        allowNull: false,
      },
      correo: {
        type: DataTypes.STRING(100),
        field:'correo',
        allowNull: true,
      },
      montoTotal: {
        type: DataTypes.INTEGER,
        field:'montoTotal',
        allowNull: false,
      },
      idTipoPago: {
        type: DataTypes.INTEGER,
        field:'idTipoPago',
        allowNull: false,
      },

      fechaCreacion: {
        type: DataTypes.DATE,
        field:'fechaCreacion',
        allowNull: false,
      },
      fechaModificacion: {
        type: DataTypes.DATE,
        field:'fechaModificacion',
        allowNull: true,
      },
      usuarioCreacion: {
        type: DataTypes.STRING(50),
        field:'usuarioCreacion',
        allowNull: false,
      },
      usuarioModificacion: {
        type: DataTypes.STRING(50),
        field:'usuarioModificacion',
        allowNull: true,
      },
}, {
    tableName: 'ClienteTemporal',
    timestamps: false
});
