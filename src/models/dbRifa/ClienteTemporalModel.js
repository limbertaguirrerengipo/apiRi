const { DataTypes, fn, BOOLEAN } = require('sequelize');
const databaseConnection = require('./dbAdministrativoFlujoConection');

exports.ClienteTemporalModal = databaseConnection.define('ClienteTemporalModal', {
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
        allowNull: true,
    },
    nroCelular: {
        type: DataTypes.STRING(50),
        field:'nroCelular',
        allowNull: false,
    },
    correo: {
        type: DataTypes.STRING,
        field:'correo',
        allowNull: true,
    },
    montoTotal: {
        type: DataTypes.DECIMAL,
        field:'montoTotal',
        allowNull: true,
    },
    idTipoPago: {
        type: DataTypes.INTEGER,
        field:'idTipoPago',
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
    tableName: 'ClienteTemporal',
    timestamps: false
});
