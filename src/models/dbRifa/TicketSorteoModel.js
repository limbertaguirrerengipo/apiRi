const { DataTypes, fn, BOOLEAN } = require('sequelize');
const databaseConnection = require('./dbAdministrativoFlujoConection');

exports.TicketSorteoModel = databaseConnection.define('TicketSorteoModel', {
    idTicketSorteo: {
        type: DataTypes.BIGINT,
        field:'idTicketSorteo',
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    idSorteo: {
        type: DataTypes.INTEGER,
        field:'idSorteo',
        primaryKey: false,
        allowNull: false,
    },
    nroTicket: {
        type: DataTypes.INTEGER,
        field:'nroTicket',
        allowNull: false,
    },
    idClienteTemporal: {
        type: DataTypes.INTEGER,
        field:'idClienteTemporal',
        primaryKey: false,
        allowNull: false,
    },
    monto: {
        type: DataTypes.DECIMAL,
        field:'monto',
        primaryKey: false,
        allowNull: false,
    },
    idTipoPago: {
        type: DataTypes.INTEGER,
        field:'idTipoPago',
        primaryKey: true,
        allowNull: false,
    },
    idEstadoPago: {
        type: DataTypes.INTEGER,
        field:'idEstadoPago',
        allowNull: false,
    },
    fecha: {
        type: DataTypes.DATE,
        field:'fecha',
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
    tableName: 'TicketSorteo',
    timestamps: false
});
