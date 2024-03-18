
const {SorteoModel} = require('../models/dbRifa/SorteoModel');
const {SorteoImagenesModel} = require('../models/dbRifa/SorteoImagenesModel');
const {Op, Sequelize,fn} = require('sequelize');
const queries = require('./queries');
const {ESTADO_SOLICITUD}  = require('../lib/constantes');

const registrarSorteoRepo = async ({titulo,cantidadTicket, precioUnitario, idMoneda, descripcion, usuario},{transaction=null}) => {
    try {
        const objSort = await SorteoModel.create({
            titulo,
            cantidadTicket, 
            precioUnitario, 
            idMoneda, 
            estado:ESTADO_SOLICITUD.ACTIVO,
            descripcion,
            linkReservas:'',
            usuarioCreacion: usuario,
            fechaCreacion: fn('GETDATE'),
            // fechaModificacion: fn('GETDATE'),
            // usuarioModificacion:'admin',
        },{
             transaction,
             raw: true,
        })
        return objSort.idSorteo;
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
const EliminarSorteoById = async ({idSorteo, usuario},{transaction=null}) => {
    try {
        return await SorteoModel.update({
            estado:ESTADO_SOLICITUD.ELIMINADO,
            usuarioModificacion:usuario
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
const AgregarListaImagenes = async (listaImagenes,{transaction=null}) => {
    try {

      return await  SorteoImagenesModel.bulkCreate( listaImagenes, { transaction })

    } catch (error) {
        throw(error)
    }
}
module.exports = {
    registrarSorteoRepo,
    ActualizarSorteo,
    obtenerSorteoById,
    EliminarSorteoById,
    AgregarListaImagenes
}