const dbAdministrativoFlujoConection = require('../models/dbRifa/dbAdministrativoFlujoConection');
const {Op, Sequelize,fn} = require('sequelize');
const { ClienteTemporalModel } = require('../models/dbRifa/ClienteTemporalModel'); 

const registrarCliente = async ({carnetIdentidad, nombreCompleto, codePais, nroCelular, correo, montoTotal, idTipoPago, lugarParticipa, urlImagen, extImagen },{transaction=null}) => {
    try {
        const objSort = await ClienteTemporalModel.create({
            carnetIdentidad,
            nombreCompleto,
            codePais,
            nroCelular,
            correo,
            montoTotal,
            idTipoPago,
            lugarParticipa,
            urlImagen,
            extImagen,
            fechaCreacion: fn('GETDATE'),
            usuarioCreacion: 'SYSTEM'
        },{
             transaction,
             raw: true,
        })
        return objSort.idClienteTemporal;
    } catch (error) {
        throw(error)
    }
}


module.exports = {
    registrarCliente
}