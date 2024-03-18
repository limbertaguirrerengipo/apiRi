const constructorSorteoService = ({logger}) => { 
    const fileName = `${__filename.substring(__dirname.length + 1, __filename.lastIndexOf('.'))}`;
    const moment = require('moment');
    const { fn } = require('sequelize');
    const {generateUniqueId5Dig} = require('./../utils/Utilidades');
    const {
        registrarSorteoRepo,
        ActualizarSorteo,
        obtenerSorteoById,
        EliminarSorteoById,
        AgregarListaImagenes
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

    return {
        registrarSorteo,
        ActualizarEstadoSorteo,
        EliminarSorteoByID
    }
} 


module.exports = {
    constructorSorteoService
}
