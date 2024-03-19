const constructorSorteoService = ({logger}) => { 
    const fileName = `${__filename.substring(__dirname.length + 1, __filename.lastIndexOf('.'))}`;
    const moment = require('moment');
    const { fn } = require('sequelize');
    const {ESTADO_SOLICITUD}  = require('../lib/constantes');
    const {generateUniqueId5Dig} = require('./../utils/Utilidades');
    const env = process.env.NODE_ENV || 'development';
    const config = require('../config/app.json')[env];
    const {
        registrarSorteoRepo,
        ActualizarSorteo,
        obtenerSorteoById,
        EliminarSorteoById,
        AgregarListaImagenes,
        obtenerlistaSorteoByFecha,
        obtenerListSorteoImagenesById
    } = require('../repositorio/SorteoRepositorio');
    const dbAdministrativoFlujoConection = require('../models/dbRifa/dbAdministrativoFlujoConection')
    const {GuardarFotoFisico} =require('../utils/guardarArchivo');
    
    const registrarSorteo = async({titulo,cantidadTicket, precioUnitario, idMoneda, descripcion, archivos, usuario}) => {
        const nombre = 'registrarSorteo'
        const log = {
            layerMethod: {
                layer: fileName,
                method: nombre
            },
            messageInicio: `Inicio de la funcion ${nombre}`,
            messageFin: `Fin de la funcion ${nombre}`,
            messageError: `Error de la funcion ${nombre}`,
            parametrosEntrada: {
                titulo,cantidadTicket, precioUnitario, idMoneda, descripcion, usuario
            }
        }
        const file= archivos;
        try {
            logger.writeInfoText(`${log.messageInicio}, parametros: ${JSON.stringify({...log.parametrosEntrada}, null, 4)}`, { ...log.layerMethod });

            const transaccionProcesada = await dbAdministrativoFlujoConection.transaction(async(t) => {
                const idSorteo = await registrarSorteoRepo({titulo,cantidadTicket, precioUnitario, idMoneda, descripcion, usuario},{transaction : t});
                const listaUrlObj = await guardarArchivo({archivos:file, idSorteo : idSorteo, usuario});
                await AgregarListaImagenes(listaUrlObj, {transaction: t })
                return true;
            });
            return transaccionProcesada;

        } catch (error) {
            logger.writeErrorText(`${log.messageError}, error: ${JSON.stringify(error, null, 4)}`, { ...log.layerMethod });
            logger.writeExceptionLog(error, { ...log.layerMethod });
            throw(error);
        }
    }
    const ActualizarEstadoSorteo = async({idSorteo, cantidadTicket, estado,usuario}) => {
        const nombre = 'ActualizarEstadoSorteo'
        const log = {
            layerMethod: {
                layer: fileName,
                method: nombre
            },
            messageInicio: `Inicio de la funcion ${nombre}`,
            messageFin: `Fin de la funcion ${nombre}`,
            messageError: `Error de la funcion ${nombre}`,
            parametrosEntrada: {
                idSorteo, cantidadTicket, estado,usuario
            }
            
        }
        try {
            logger.writeInfoText(`${log.messageInicio}, parametros: ${JSON.stringify({...log.parametrosEntrada}, null, 4)}`, { ...log.layerMethod });
            const objSorteo = await obtenerSorteoById({idSorteo});
            if(!objSorteo) throw new Error('No se encontro el sorteo ID');
        
            const transaccionProcesada = await dbAdministrativoFlujoConection.transaction(async(t) => {
                const actualizar = await ActualizarSorteo({idSorteo, cantidadTicket, estado,usuario},{transaction : t});
                return actualizar
            });
            return transaccionProcesada;
        } catch (error) {
            
            
            logger.writeErrorText(`${log.messageError}, error: ${JSON.stringify(error, null, 4)}`, { ...log.layerMethod });
            logger.writeExceptionLog(error, { ...log.layerMethod });
            throw(error);
        }
    }
    const EliminarSorteoByID = async({idSorteo, usuario}) => {
        const nombre = 'EliminarSorteoByID'
        const log = {
            layerMethod: {
                layer: fileName,
                method: nombre
            },
            messageInicio: `Inicio de la funcion ${nombre}`,
            messageFin: `Fin de la funcion ${nombre}`,
            messageError: `Error de la funcion ${nombre}`,
            parametrosEntrada: {
                idSorteo, usuario
            }
        }
        try {
            logger.writeInfoText(`${log.messageInicio}, parametros: ${JSON.stringify({...log.parametrosEntrada}, null, 4)}`, { ...log.layerMethod });
            const transaccionProcesada = await dbAdministrativoFlujoConection.transaction(async(t) => {
                const objElimi = await EliminarSorteoById({idSorteo, usuario},{transaction : t});
                logger.writeInfoText(`${log.messageInicio}, respond delete: ${JSON.stringify({objElimi}, null, 4)}`, { ...log.layerMethod });
                return objElimi;
            });
            return transaccionProcesada;
        } catch (error) {
            logger.writeErrorText(`${log.messageError}, error: ${JSON.stringify(error, null, 4)}`, { ...log.layerMethod });
            logger.writeExceptionLog(error, { ...log.layerMethod });
            throw(error);
        }
    }
    const guardarArchivo = async({archivos, idSorteo, usuario}) => {
        const nombre = 'guardarArchivo'
        const log = {
            layerMethod: {
                layer: fileName,
                method: nombre
            },
            messageInicio: `Inicio de la funcion ${nombre}`,
            messageFin: `Fin de la funcion ${nombre}`,
            messageError: `Error de la funcion ${nombre}`,
            parametrosEntrada: {
                idSorteo, usuario
            }
        }
        try {
            logger.writeInfoText(`${log.messageInicio}, parametros: ${JSON.stringify({...log.parametrosEntrada}, null, 4)}`, { ...log.layerMethod });
          
            const llaveValorDocumento= 'base64';
            let prefijoArchivo= usuario;
            let nameSubrutaArchivo = 'sorteo';
            let nameSubrutaArchivo2 = obtenerCodigoFormateadoAñoCodigo({codigoStringRegex: "000000", numeroValorEntero: idSorteo})

            const archivosGuardar = [];
            const subRutaArchivo = `sorteo/${new Date().getFullYear()}/${nameSubrutaArchivo2}/`;
            for(let documento of archivos){
                let id = 0
                id= generateUniqueId5Dig();
                const rutaImagenRegistrada = await GuardarFotoFisico({base64: documento[llaveValorDocumento], nombreArchivo: id +documento.nombreArchivo +'_' +prefijoArchivo, extension: documento.extension, subRutaArchivo : subRutaArchivo})
                archivosGuardar.push({
                    idSorteo: idSorteo,
                    urlImagen: rutaImagenRegistrada,
                    extension: documento.extension,
                    nombreImagen: documento.nombreArchivo,
                    estado:true,
                    usuarioCreacion:usuario,
                    fechaCreacion: fn('GETDATE'),
                });
            }
            return archivosGuardar;

        } catch (error) {
            logger.writeErrorText(`${log.messageError}, error: ${JSON.stringify(error, null, 4)}`, { ...log.layerMethod });
            logger.writeExceptionLog(error, { ...log.layerMethod });
            throw(error);
        }
    }
    const codigoGenerado = ({codigoStringRegex, numeroValorEntero}) => {
        const cantidadCerosMostrar = codigoStringRegex.length - numeroValorEntero.toString().length;
        return codigoStringRegex.substring(0, cantidadCerosMostrar);
    }
    const obtenerCodigoFormateadoAñoCodigo = ({codigoStringRegex, numeroValorEntero}) => {
        const mascara = codigoGenerado({codigoStringRegex, numeroValorEntero});
        return moment().format('MM')+'-' + mascara + numeroValorEntero;
    }
    const obtenerListadaSorteoByFecha = async({fechaInicio, fechaFin}) => {
        const nombre = 'obtenerListadaSorteoByFecha'
        const log = {
            layerMethod: {
                layer: fileName,
                method: nombre
            },
            messageInicio: `Inicio de la funcion ${nombre}`,
            messageFin: `Fin de la funcion ${nombre}`,
            messageError: `Error de la funcion ${nombre}`,
            parametrosEntrada: {
                fechaInicio, fechaFin
            }
        }
        try {
            logger.writeInfoText(`${log.messageInicio}, parametros: ${JSON.stringify({...log.parametrosEntrada}, null, 4)}`, { ...log.layerMethod });
            const transaccionProcesada = await dbAdministrativoFlujoConection.transaction(async(t) => {
            const listado = await obtenerlistaSorteoByFecha({fechaInicio, fechaFin}, {transaction : t});
            return listado
            });
            return transaccionProcesada;
       
        } catch (error) {
            logger.writeErrorText(`${log.messageError}, error: ${JSON.stringify(error, null, 4)}`, { ...log.layerMethod });
            logger.writeExceptionLog(error, { ...log.layerMethod });
            throw(error);
        }
    }
    const obtenerDetalleSorteoById = async({idSorteo}) => {
        const nombre = 'obtenerDetalleSorteoById'
        const log = {
            layerMethod: {
                layer: fileName,
                method: nombre
            },
            messageInicio: `Inicio de la funcion ${nombre}`,
            messageFin: `Fin de la funcion ${nombre}`,
            messageError: `Error de la funcion ${nombre}`,
            parametrosEntrada: {
                idSorteo
            }
        }
        try {
            logger.writeInfoText(`${log.messageInicio}, parametros: ${JSON.stringify({...log.parametrosEntrada}, null, 4)}`, { ...log.layerMethod });
            const transaccionProcesada = await dbAdministrativoFlujoConection.transaction(async(t) => {

                let obj = await obtenerSorteoById({idSorteo}, {transaction : t});
                if(obj === null) throw new Error('No existe el Ticket de sorteo.');
                if(obj && obj.estado === ESTADO_SOLICITUD.INACTIVO) throw new Error('El Ticket de sorteo ya no se encuentra disponible');
                const urlServer = config.serverConfigurations.url + '/static/';
                const lista = await obtenerListSorteoImagenesById({idSorteo, urlServer},{transaction : t}); 
                obj ={ ...obj, imagenes: lista}
                return obj
            });
            return transaccionProcesada;
       
        } catch (error) {
            logger.writeErrorText(`${log.messageError}, error: ${JSON.stringify(error, null, 4)}`, { ...log.layerMethod });
            logger.writeExceptionLog(error, { ...log.layerMethod });
            throw(error);
        }
    }
    return {
        registrarSorteo,
        ActualizarEstadoSorteo,
        EliminarSorteoByID,
        obtenerListadaSorteoByFecha,
        obtenerDetalleSorteoById
    }
} 


module.exports = {
    constructorSorteoService
}
