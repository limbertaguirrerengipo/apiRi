const constructorSorteoService = ({logger}) => { 
    const fileName = `${__filename.substring(__dirname.length + 1, __filename.lastIndexOf('.'))}`;
    const moment = require('moment');
    const { fn } = require('sequelize');
    const { encrypt } = require('../midlwares/encrypt')
    const {
        ESTADO_SOLICITUD,
        ESTADO_PAGO,
        TIPO_PAGO
    }  = require('../lib/constantes');
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
        obtenerListSorteoImagenesById,
        obtenerListaTipoPagoDisponibles,
        agregarListTicketsSorteoMasivo,
        obtenerCantidadSorteosRegistrados,
        obtenerDetalleTicketByIdStatus
    } = require('../repositorio/SorteoRepositorio');
    const {
        registrarCliente
    } = require('../repositorio/ClienteRepositorio');
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
            const newData = listado.map(item => ({ ...item, cadena: encrypt(item.idSorteo.toString()) }));
            return newData
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
                const listTipoPagos = await obtenerListaTipoPagoDisponibles({urlServerImage: urlServer }, {transaction : t})
                obj ={ ...obj, listImagenes: lista, listTipoPagos}
                return obj
            });
            return transaccionProcesada;
       
        } catch (error) {
            logger.writeErrorText(`${log.messageError}, error: ${JSON.stringify(error, null, 4)}`, { ...log.layerMethod });
            logger.writeExceptionLog(error, { ...log.layerMethod });
            throw(error);
        }
    }
    const registrarTickets = async({idSorteo, carnetIdentidad, cantidadTicket, nombreCompleto, codePais, nroCelular, correo, idTipoPago }) => {
        const nombre = 'registrarTickets'
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
                //pagar POR TIPO PAGO
                let cantidadLimiteTicket = parseInt(obj.cantidadTicket);
                 let PrecioUni = obj.precioUnitario;
                 let TotalCalculado = parseFloat(obj.precioUnitario) * parseFloat(cantidadTicket);
                 ////verificar la cantidad ticket disponibles... 
                 await validarCantidadTicketDisponibles({idSorteo, cantidadLimiteTicket, nuevaCantidadTickets: cantidadTicket })

                const idClienteTemporal = await registrarCliente({ carnetIdentidad, nombreCompleto, codePais, nroCelular, correo, montoTotal:TotalCalculado, idTipoPago },{transaction: t });
                const listTicketsGenerados = generarListTickets({idSorteo, cantidadTicket, idClienteTemporal, monto: PrecioUni, idTipoPago, idEstadoPago:ESTADO_PAGO.PENDIENTE }); 
                const lista = await agregarListTicketsSorteoMasivo(listTicketsGenerados,{transaction:t});
                let codigoTick = lista.map(x => {
                    return { idTicket: String(parseInt(x.idTicketSorteo)).padStart(config.sorteo.longitudTicketsCeros, '0') };
                });
                //enviar mail o wpp

                return {
                    idSorteo: idSorteo,
                    tickets: codigoTick
                };

            });
            return transaccionProcesada;
       
        } catch (error) {
            logger.writeErrorText(`${log.messageError}, error: ${JSON.stringify(error, null, 4)}`, { ...log.layerMethod });
            logger.writeExceptionLog(error, { ...log.layerMethod });
            throw(error);
        }
    }

    const  generarListTickets = ({idSorteo, cantidadTicket, idClienteTemporal, monto, idTipoPago, idEstadoPago}) => {
         const numero = cantidadTicket;
        const arrayNumeros = Array.from({ length: numero });
        const lista = arrayNumeros.map((_, indice) => {
            return { idSorteo,
                idClienteTemporal,
                monto,
                idTipoPago,
                idEstadoPago: idTipoPago === TIPO_PAGO.EFECTIVO? ESTADO_PAGO.PENDIENTE: idEstadoPago,
                fecha:fn('GETDATE'), // idTipoPago === TIPO_PAGO.EFECTIVO? null : fn('GETDATE'),
                fechaCreacion:fn('GETDATE'),
                usuarioCreacion:'SYSTEM'
            };
        });
        return lista;
    }
    const validarCantidadTicketDisponibles = async ({idSorteo, cantidadLimiteTicket, nuevaCantidadTickets }) => {
        try{
           const listTicket = await obtenerCantidadSorteosRegistrados({idSorteo});
            let nroList = nuevaCantidadTickets + listTicket.length 
           if( nroList <= cantidadLimiteTicket){
              //todo okey
               let n=0;
           }else{
             let disponible = cantidadLimiteTicket - listTicket.length;
              throw new Error(`Solo hay ${disponible} tickets Disponibles, ustede `);
           }

        } catch (error) {
            throw(error);
        }
    }

    const obtenerTicketsByIdSorteo = async({idSorteo, idEstadoPago}) => {
        const nombre = 'obtenerTicketsByIdSorteo'
        const log = {
            layerMethod: {
                layer: fileName,
                method: nombre
            },
            messageInicio: `Inicio de la funcion ${nombre}`,
            messageFin: `Fin de la funcion ${nombre}`,
            messageError: `Error de la funcion ${nombre}`,
            parametrosEntrada: {
                idSorteo, idEstadoPago
            }
        }
        try {
            logger.writeInfoText(`${log.messageInicio}, parametros: ${JSON.stringify({...log.parametrosEntrada}, null, 4)}`, { ...log.layerMethod });
            const transaccionProcesada = await dbAdministrativoFlujoConection.transaction(async(t) => {

                let obj = await obtenerSorteoById({idSorteo}, {transaction : t});
                if(obj === null) throw new Error('No existe el Ticket de sorteo.');
                if(obj && obj.estado === ESTADO_SOLICITUD.INACTIVO) throw new Error('El Ticket de sorteo ya no se encuentra disponible');
                const lista= await obtenerDetalleTicketByIdStatus({idSorteo}, {transaction : t});
                return lista
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
        obtenerDetalleSorteoById,
        registrarTickets,
        obtenerTicketsByIdSorteo
    }
} 


module.exports = {
    constructorSorteoService
}
