const { DataTypes, fn, BOOLEAN } = require('sequelize');
const databaseConnection = require('./dbAdministrativoFlujoConection');

exports.SorteoImagenesModel = databaseConnection.define('SorteoImagenesModel', {
  idSorteoImagenes: {
        type: DataTypes.INTEGER,
        field:'idSorteoImagenes',
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
      nombreImagen: {
        type: DataTypes.STRING,
        field:'nombreImagen',
        allowNull: true,
      },
      extension: {
        type: DataTypes.STRING(50),
        field:'extension',
        allowNull: false,
      },
      estado: {
        type: DataTypes.BOOLEAN,
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
    tableName: 'SorteoImagenes',
    timestamps: false
});
