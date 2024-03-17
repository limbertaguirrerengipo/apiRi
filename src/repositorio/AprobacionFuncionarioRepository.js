//const {AprobacionFuncionarioModel} = require('../models/dbAdministrativoFlujo/AprobacionFuncionario');
// const {FuncionariosModel} = require('../models/dbComisiones/FuncionariosModel');
const {Op, Sequelize} = require('sequelize');
const queries = require('./queries');

const obtenerSolicitantesPorAprobador = async ({IdEmpleadoAprobador}) => {
    try {

        // return await FuncionariosModel.findAll({
        //     include: [
        //         {
        //             model: AprobacionFuncionarioModel,
        //             as: 'Aprobacion',
        //             attributes: ['IdEmpleadoAprobador'],
        //             where:{
        //                 IdEmpleadoAprobador:{
        //                     [Op.not]: IdEmpleadoAprobador
        //                 },
        //             },
        //             required: true
        //         },
        //     ],
        // });
    } catch (error) {
        throw(error);
    }
}
module.exports = {
    obtenerSolicitantesPorAprobador
}

