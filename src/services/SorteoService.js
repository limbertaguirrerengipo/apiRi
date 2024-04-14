const constructorSorteoService = ({logger}) => { 
    const fileName = `${__filename.substring(__dirname.length + 1, __filename.lastIndexOf('.'))}`;
    const moment = require('moment');
    const { fn } = require('sequelize');
    const { encrypt, decrypt } = require('../midlwares/encrypt')
    const {
        ESTADO_SOLICITUD,
        ESTADO_PAGO,
        TIPO_PAGO
    }  = require('../lib/constantes');
    const {generateUniqueId5Dig} = require('./../utils/Utilidades');
    const env = process.env.NODE_ENV || 'development';
    const config = require('../config/app.json')[env];
    
    const {
        enviarMensaje
    } = require('./MensajeService');


    const {
        registrarSorteoRepo,
        ActualizarSorteo,
        obtenerSorteoById,
        EliminarSorteoById,
        AgregarListaImagenes,
        AgregarSorteoListaCobroQr,
        obtenerlistaSorteoByFecha,
        obtenerListSorteoImagenesById,
        obtenerImagenQrSorteosTiposPagosXSorteoId,
        obtenerListaTipoPagoDisponibles,
        agregarListTicketsSorteoMasivo,
        obtenerTicketRandonSorteo,
        obtenerDetalleTicketByIdStatus,
        obtenerDetalleClienteXSorteoId,
        obtenerDetalleSorteoClienteId,
        TicketSorteoClienteXIds,
        eliminarTicketClienteIDS,
        obtenerTodosTicketsSorteoId,
        ActualizarTicketSorteoIDS
    } = require('../repositorio/SorteoRepositorio');
    const {
        registrarCliente
    } = require('../repositorio/ClienteRepositorio');
    const dbAdministrativoFlujoConection = require('../models/dbRifa/dbAdministrativoFlujoConection')
    const {GuardarFotoFisico} =require('../utils/guardarArchivo');
    
    const registrarSorteo = async({titulo,cantidadTicket, precioUnitario, idMoneda, descripcion, archivos, imageCobros, usuario}) => {
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
            const listaTickets = new Array(cantidadTicket).fill().map((_, i) => i + 1);

            const transaccionProcesada = await dbAdministrativoFlujoConection.transaction(async(t) => {
                const idSorteo = await registrarSorteoRepo({titulo,cantidadTicket, precioUnitario, idMoneda, descripcion, usuario},{transaction : t});
                const ticketsMasivo = await armarobjTickets({idSorteo, monto:precioUnitario, usuario, listArray:listaTickets});
                const add = await agregarListTicketsSorteoMasivo(ticketsMasivo,{transaction: t });
                const listaurlCobro = await guardarArchivoImagenCobroQr({listaImg:imageCobros, idSorteo : idSorteo, usuario});

                const listaUrlObj = await guardarArchivo({archivos:file, idSorteo : idSorteo, usuario});
                await AgregarListaImagenes(listaUrlObj, {transaction: t })
                await AgregarSorteoListaCobroQr(listaurlCobro, {transaction: t })
                return true;
            });
            return transaccionProcesada;

        } catch (error) {
            logger.writeErrorText(`${log.messageError}, error: ${JSON.stringify(error, null, 4)}`, { ...log.layerMethod });
            logger.writeExceptionLog(error, { ...log.layerMethod });
            throw(error);
        }
    }
    const armarobjTickets = ({idSorteo, monto, usuario, listArray}) =>{
        let lista = [];
        for (const elemento of listArray) {
            let obj ={
                idSorteo:idSorteo,
                nroTicket:elemento, 
                idClienteTemporal:0,
                monto:monto,
                idTipoPago:0,
                idEstadoPago:ESTADO_PAGO.PENDIENTE,
                usuarioCreacion: usuario,
                fecha:fn('GETDATE'),
                fechaCreacion: fn('GETDATE')
            }
            lista.push(obj);
        }
        return lista;
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
    const guardarArchivoImagenCobroQr = async({listaImg, idSorteo, usuario}) => {
        const nombre = 'guardarArchivoImagenCobroQr'
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
            const subRutaArchivo = `sorteo/cobro/${new Date().getFullYear()}/${nameSubrutaArchivo2}/`;
            for(let documento of listaImg){
                let id = 0
                id= generateUniqueId5Dig();
                const rutaImagenRegistrada = await GuardarFotoFisico({base64: documento[llaveValorDocumento], nombreArchivo: id +documento.nombreArchivo +'_' +prefijoArchivo, extension: documento.extension, subRutaArchivo : subRutaArchivo})
                archivosGuardar.push({
                    idSorteo: idSorteo,
                    urlImagen: rutaImagenRegistrada,
                    extension: documento.extension,
                    idTipoPago:documento.idTipoPago
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
                const imagesCobros= await obtenerImagenQrSorteosTiposPagosXSorteoId({idSorteo, urlServer},{transaction : t}); 
                const listTipoPagos = await obtenerListaTipoPagoDisponibles({urlServerImage: urlServer }, {transaction : t})
                obj ={ ...obj, listImagenes: lista, listTipoPagos, imagesCobros}
                return obj
            });
            return transaccionProcesada;
       
        } catch (error) {
            logger.writeErrorText(`${log.messageError}, error: ${JSON.stringify(error, null, 4)}`, { ...log.layerMethod });
            logger.writeExceptionLog(error, { ...log.layerMethod });
            throw(error);
        }
    }
    const registrarTickets = async({idSorteo, carnetIdentidad, cantidadTicket, nombreCompleto, codePais, nroCelular, correo, idTipoPago, lugarParticipa, uploadComprobante }) => {
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
                 let TotalCalculado = parseFloat(obj.precioUnitario) * parseFloat(cantidadTicket);
                ////verificar la cantidad ticket disponibles... 
                const ticketsList =   await validarObtenerCantidadTicketDisponibles({idSorteo, nuevaCantidadTickets: cantidadTicket })

                 const imageComprobante = !uploadComprobante? null: await guardarComprobanteCliente({imagenComprobante:uploadComprobante, idSorteo,carnet:carnetIdentidad})
                const idClienteTemporal = await registrarCliente({
                    carnetIdentidad,
                    nombreCompleto,
                    codePais,
                    nroCelular,
                    correo,
                    montoTotal:TotalCalculado,
                    idTipoPago,
                    lugarParticipa,
                    urlImagen:imageComprobante?.urlImagen || null,
                    extImagen:imageComprobante?.extension || null
                },{transaction: t });
             
                await listUpdateTicketClientes({idClienteTemporal, idTipoPago, ticketsList},{transaction: t});
                let codigoTick = ticketsList.map(x => {
                    return { idTicket: String(parseInt(x.nroTicket)).padStart(config.sorteo.longitudTicketsCeros, '0') };
                });
                //enviar mail o wpp
                enviarMensaje({
                    tickets: codigoTick,
                    extension:codePais,
                    nroCelular:nroCelular,
                    titulo:'Rifa Grupo Napoles',
                    descripcion:'Gracias por participar... Mucha suerte!!!'
                })
                
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
    const listUpdateTicketClientes = async ({idClienteTemporal, idTipoPago, ticketsList},{transaction=null}) =>{
        try {
        // ActualizarTicketSorteoIDS

        for (const item of ticketsList) {
            await ActualizarTicketSorteoIDS({idTicketSorteo:parseInt(item.idTicketSorteo), idSorteo: item.idSorteo, idClienteTemporal, idTipoPago},{transaction})
            const n = 0;
        }

        } catch (error) {
            throw(error);
        }

    }

    const guardarComprobanteCliente = async({imagenComprobante, idSorteo, carnet}) => {
        const nombre = 'guardarComprobanteCliente'
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
          
            const llaveValorDocumento= 'base64';
            let nameSubrutaArchivo2 = obtenerCodigoFormateadoAñoCodigo({codigoStringRegex: "00", numeroValorEntero: idSorteo})
            const subRutaArchivo = `cliente/comprobante/${new Date().getFullYear()}/${nameSubrutaArchivo2}/`;
           
                let id = 0
                id= generateUniqueId5Dig();
                const rutaImagenRegistrada = await GuardarFotoFisico({base64: imagenComprobante[llaveValorDocumento], nombreArchivo: id +'_'+carnet, extension: imagenComprobante.extension, subRutaArchivo : subRutaArchivo})
                const  archivosGuardar ={
                    idSorteo: idSorteo,
                    urlImagen: rutaImagenRegistrada,
                    extension: imagenComprobante.extension
                };
        
            return archivosGuardar;

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
    const validarObtenerCantidadTicketDisponibles = async ({idSorteo, nuevaCantidadTickets }) => {
        try{
           const listTicket = await obtenerTicketRandonSorteo({idSorteo, cantidadTicket: nuevaCantidadTickets});
            
           if( nuevaCantidadTickets === listTicket.length ){
              //todo okey
              return listTicket;
           }else{
             let disponible = listTicket.length;
              throw new Error(`Solo hay ${disponible} tickets disponibles.`);
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

    const desEncriptarIdSorteo = async({idSorteo}) => {
        const nombre = 'desEncriptarIdSorteo'
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
            
             const idDes = parseInt(decrypt(idSorteo));
             if (isNaN(idDes)) {
                throw new Error('Codigo invalido');
             }
             return idDes;
       
        } catch (error) {
            logger.writeErrorText(`${log.messageError}, error: ${JSON.stringify(error, null, 4)}`, { ...log.layerMethod });
            logger.writeExceptionLog(error, { ...log.layerMethod });
            throw(error);
        }
    }

    const obtenerDetalleClienteXSorteo = async({idSorteo}) => {
        const nombre = 'obtenerDetalleClienteXSorteo'
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
            const urlServer = config.serverConfigurations.url + '/static/';
            const listado = await obtenerDetalleClienteXSorteoId({idSorteo, urlServer}, {transaction : t});
            return listado
            });
            return transaccionProcesada;
       
        } catch (error) {
            logger.writeErrorText(`${log.messageError}, error: ${JSON.stringify(error, null, 4)}`, { ...log.layerMethod });
            logger.writeExceptionLog(error, { ...log.layerMethod });
            throw(error);
        }
    }
    const obtenerDetalleSorteoClienteID = async({idSorteo, idClienteTemporal}) => {
        const nombre = 'obtenerDetalleSorteoClienteID'
        const log = {
            layerMethod: {
                layer: fileName,
                method: nombre
            },
            messageInicio: `Inicio de la funcion ${nombre}`,
            messageFin: `Fin de la funcion ${nombre}`,
            messageError: `Error de la funcion ${nombre}`,
            parametrosEntrada: {
                idSorteo, idClienteTemporal
            }
        }
        try {
            logger.writeInfoText(`${log.messageInicio}, parametros: ${JSON.stringify({...log.parametrosEntrada}, null, 4)}`, { ...log.layerMethod });
            const transaccionProcesada = await dbAdministrativoFlujoConection.transaction(async(t) => {
            const listado = await obtenerDetalleSorteoClienteId({idSorteo, idClienteTemporal}, {transaction : t});
            let codigoTick = listado.map(x => {
                return { ...x, idTicket: String(parseInt(x.idTicketSorteo)).padStart(config.sorteo.longitudTicketsCeros, '0') };
            });

            return codigoTick
            });
            return transaccionProcesada;
       
        } catch (error) {
            logger.writeErrorText(`${log.messageError}, error: ${JSON.stringify(error, null, 4)}`, { ...log.layerMethod });
            logger.writeExceptionLog(error, { ...log.layerMethod });
            throw(error);
        }
    }
    const updateAPlicarEstadoDetalleCliente = async({listaIds, usuario}) => {
        const nombre = 'updateAPlicarEstadoDetalleCliente'
        const log = {
            layerMethod: {
                layer: fileName,
                method: nombre
            },
            messageInicio: `Inicio de la funcion ${nombre}`,
            messageFin: `Fin de la funcion ${nombre}`,
            messageError: `Error de la funcion ${nombre}`,
            parametrosEntrada: {
                listaIds,
                usuario
            }
        }
        try {
            logger.writeInfoText(`${log.messageInicio}, parametros: ${JSON.stringify({...log.parametrosEntrada}, null, 4)}`, { ...log.layerMethod });
            const transaccionProcesada = await dbAdministrativoFlujoConection.transaction(async(t) => {
            
            // return listado
            for(let item of listaIds){
                const update = await TicketSorteoClienteXIds(item, usuario, {transaction : t});
            }
            });
            return transaccionProcesada;
       
        } catch (error) {
            logger.writeErrorText(`${log.messageError}, error: ${JSON.stringify(error, null, 4)}`, { ...log.layerMethod });
            logger.writeExceptionLog(error, { ...log.layerMethod });
            throw(error);
        }
    }

    const eliminarTicketClienteIds = async({idTicketSorteo, idClienteTemporal, usuario}) => {
        const nombre = 'eliminarTicketClienteIds'
        const log = {
            layerMethod: {
                layer: fileName,
                method: nombre
            },
            messageInicio: `Inicio de la funcion ${nombre}`,
            messageFin: `Fin de la funcion ${nombre}`,
            messageError: `Error de la funcion ${nombre}`,
            parametrosEntrada: {
                idTicketSorteo, idClienteTemporal, usuario
            }
        }
        try {
            logger.writeInfoText(`${log.messageInicio}, parametros: ${JSON.stringify({...log.parametrosEntrada}, null, 4)}`, { ...log.layerMethod });
            const transaccionProcesada = await dbAdministrativoFlujoConection.transaction(async(t) => {
            const update = await eliminarTicketClienteIDS({idTicketSorteo, idClienteTemporal}, usuario, {transaction : t});
            return update
            });
            return transaccionProcesada;
       
        } catch (error) {
            logger.writeErrorText(`${log.messageError}, error: ${JSON.stringify(error, null, 4)}`, { ...log.layerMethod });
            logger.writeExceptionLog(error, { ...log.layerMethod });
            throw(error);
        }
    }

    const obtenerTodosSorteoId = async({idSorteo}) => {
        const nombre = 'obtenerTodosSorteoId'
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
            const lista = await obtenerTodosTicketsSorteoId({idSorteo}, {transaction : t});
            let codigoTick = lista.map(x => {
                return { ...x, idTicket: String(parseInt(x.idTicket)).padStart(config.sorteo.longitudTicketsCeros, '0') };
            });
            return codigoTick
            });
            return transaccionProcesada;
       
        } catch (error) {
            logger.writeErrorText(`${log.messageError}, error: ${JSON.stringify(error, null, 4)}`, { ...log.layerMethod });
            logger.writeExceptionLog(error, { ...log.layerMethod });
            throw(error);
        }
    }

    const obtenerTipoPagos = async() => {
        const nombre = 'obtenerTipoPagos'
        const log = {
            layerMethod: {
                layer: fileName,
                method: nombre
            },
            messageInicio: `Inicio de la funcion ${nombre}`,
            messageFin: `Fin de la funcion ${nombre}`,
            messageError: `Error de la funcion ${nombre}`,
            parametrosEntrada: {
                
            }
        }
        try {
            logger.writeInfoText(`${log.messageInicio}, parametros: ${JSON.stringify({...log.parametrosEntrada}, null, 4)}`, { ...log.layerMethod });
            const transaccionProcesada = await dbAdministrativoFlujoConection.transaction(async(t) => {
                const urlServer = config.serverConfigurations.url + '/static/';
                const listTipoPagos = await obtenerListaTipoPagoDisponibles({urlServerImage: urlServer }, {transaction : t})
                return listTipoPagos
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
        obtenerTicketsByIdSorteo,
        desEncriptarIdSorteo,
        obtenerDetalleClienteXSorteo,
        obtenerDetalleSorteoClienteID,
        updateAPlicarEstadoDetalleCliente,
        eliminarTicketClienteIds,
        obtenerTodosSorteoId,
        obtenerTipoPagos
    }
} 


module.exports = {
    constructorSorteoService
}
