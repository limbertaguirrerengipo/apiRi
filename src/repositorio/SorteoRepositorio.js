
const {SorteoModel} = require('../models/dbRifa/SorteoModel');
const {Op, Sequelize,fn} = require('sequelize');
const queries = require('./queries');

const registrarSorteoRepo = async ({titulo,cantidadTicket, precioUnitario, idMoneda, descripcion},{transaction=null}) => {
    try {
        return await SorteoModel.create({
            titulo,cantidadTicket, 
            precioUnitario, 
            idMoneda, 
            estado:1,
            descripcion,
            linkReservas:'localhost:300',
            usuarioCreacion:'admin',
            fechaCreacion: fn('GETDATE'),
            fechaModificacion: fn('GETDATE'),
            usuarioModificacion:'admin',
        },{
             transaction,
             raw: true,
        })
    } catch (error) {
        throw(error)
    }
}
module.exports = {
    registrarSorteoRepo
}