
const {SorteoModel} = require('../models/dbRifa/SorteoModel');
const {Op, Sequelize,fn} = require('sequelize');
const queries = require('./queries');
const {ESTADO_SOLICITUD}  = require('../lib/constantes');

const registrarSorteoRepo = async ({titulo,cantidadTicket, precioUnitario, idMoneda, descripcion},{transaction=null}) => {
    try {
        return await SorteoModel.create({
            titulo,
            cantidadTicket, 
            precioUnitario, 
            idMoneda, 
            estado:ESTADO_SOLICITUD.ACTIVO,
            descripcion,
            linkReservas:'localhost:300',
            usuarioCreacion:'admin',
            fechaCreacion: fn('GETDATE'),
            // fechaModificacion: fn('GETDATE'),
            // usuarioModificacion:'admin',
        },{
             transaction,
             raw: true,
        })
    } catch (error) {
        throw(error)
    }
}
const ActualizarSorteo = async ({idSorteo, cantidadTicket, estado,usuario},{transaction=null}) => {
    try {
        return await SorteoModel.update({
            cantidadTicket:cantidadTicket,
            estado:estado,
            usuarioModificacion:usuario,
            fechaModificacion: fn('GETDATE'),
        },{
            where: {
                idSorteo: idSorteo,
            },
            transaction: transaction
        })

    } catch (error) {
        throw(error)
    }
}
const obtenerSorteoById = async({idSorteo}) => {
    try {
        return await SorteoModel.findOne({
            where: {
                idSorteo:idSorteo,
                estado: {
                    [Op.in]: [ESTADO_SOLICITUD.ACTIVO, ESTADO_SOLICITUD.INACTIVO] 
                }
            },
            raw: true
        });
    } catch (error) {
        throw(error)
    }
}
module.exports = {
    registrarSorteoRepo,
    ActualizarSorteo,
    obtenerSorteoById
}