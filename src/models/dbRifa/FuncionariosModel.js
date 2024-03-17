const { DataTypes, fn } = require('sequelize');
const databaseConnection = require('./dbAdministrativoFlujoConection');

exports.FuncionariosModel = databaseConnection.define('FuncionariosModel', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      codfuncionario: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      idempleado: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      nombreEmpleado: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      emp: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      idarea: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      nombreArea: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      idcargo: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      nombreCargo: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      jerarquia: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      domainUser: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      CI: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      activo: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      fechaNacimiento: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      estado: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      fechains: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      asignar_solicitud: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      contador_sesion: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      IdEmpresa: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
}, {
    tableName: 'Funcionarios',
    timestamps: false
});
