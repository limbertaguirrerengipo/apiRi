const fileName = `${__filename.substring(__dirname.length + 1, __filename.lastIndexOf('.'))}`;
const Logger = require('../logger');
let logger = new Logger.Logger();
const Semaphore = require('semaphore');
const semaforo = Semaphore(1);


const {constructorSorteoService} = require('../services/SorteoService');
const {
    registrarSorteo,
    ActualizarEstadoSorteo,
    EliminarSorteoByID,
    obtenerListadaSorteoByFecha,
    obtenerDetalleSorteoById,
    registrarTickets,
    obtenerTicketsByIdSorteo,
    desEncriptarIdSorteo,
    obtenerDetalleClienteXSorteo,
    obtenerDetalleSorteoClienteID
} = constructorSorteoService({logger});

exports.regitrarSorteo = async(req, res) => {
    const nameService = 'regitrarSorteo'
    const log = {
        layerMethod: {
            layer: fileName,
            method: nameService
        },
        messageInicio: `Inicio del servicio ${nameService}`,
        messageFin: `Fin del servicio ${nameService}`,
        messageError: `Error del servicio ${nameService}`,
        parametrosEntrada: {
            parameterHeaders: {
                ...req.headers
            }
        }
    }
    try {
        logger.writeInfoText(`${log.messageInicio}, ${JSON.stringify(log.parametrosEntrada, null, 4)}`, { ...log.layerMethod });
        const {titulo,cantidadTicket, precioUnitario, idMoneda, descripcion, archivos, usuario } = req.body
        const reg = await registrarSorteo({titulo,cantidadTicket, precioUnitario, idMoneda, descripcion, archivos, usuario });
        res.json({
            status: 0,
            mensaje: 'success',
            data: {
                reg
            }
        })
    } catch (error) {
        logger.writeErrorText(`${log.messageError}`, { ...log.layerMethod });
        logger.writeExceptionLog(error, { ...log.layerMethod });
        res.json({
            status: 1,
            mensaje: (error.message) ? (error.message) : error,
            data: null
        })
    }
}


exports.ActualizarSorteo = async(req, res) => {
    const nameService = 'ActualizarSorteo'
    const log = {
        layerMethod: {
            layer: fileName,
            method: nameService
        },
        messageInicio: `Inicio del servicio ${nameService}`,
        messageFin: `Fin del servicio ${nameService}`,
        messageError: `Error del servicio ${nameService}`,
        parametrosEntrada: {
            parameterHeaders: {
                ...req.headers
            }
        }
    }
    try {
        logger.writeInfoText(`${log.messageInicio}, ${JSON.stringify(log.parametrosEntrada, null, 4)}`, { ...log.layerMethod });
        const {idSorteo, cantidadTicket, estado,usuario } = req.body
        const respo = await ActualizarEstadoSorteo({idSorteo, cantidadTicket, estado,usuario });
        res.json({
            status: 0,
            mensaje: 'success',
            data: {
                respo
            }
        })
    } catch (error) {
        logger.writeErrorText(`${log.messageError}`, { ...log.layerMethod });
        logger.writeExceptionLog(error, { ...log.layerMethod });
        res.json({
            status: 1,
            mensaje: (error.message) ? (error.message) : error,
            data: null
        })
    }
}
exports.EliminarSorteo = async(req, res) => {
    const nameService = 'EliminarSorteo'
    const log = {
        layerMethod: {
            layer: fileName,
            method: nameService
        },
        messageInicio: `Inicio del servicio ${nameService}`,
        messageFin: `Fin del servicio ${nameService}`,
        messageError: `Error del servicio ${nameService}`,
        parametrosEntrada: {
            parameterHeaders: {
                ...req.headers
            }
        }
    }
    try {
        
        const {idSorteo, usuario } = req.body
        logger.writeInfoText(`${log.messageInicio}, ${JSON.stringify(req.body, null, 4)}`, { ...log.layerMethod });
        const respo = await EliminarSorteoByID({idSorteo, usuario });
        res.json({
            status: 0,
            mensaje: 'success',
            data: {
                respo
            }
        })
    } catch (error) {
        logger.writeErrorText(`${log.messageError}`, { ...log.layerMethod });
        logger.writeExceptionLog(error, { ...log.layerMethod });
        res.json({
            status: 1,
            mensaje: (error.message) ? (error.message) : error,
            data: null
        })
    }
}
exports.obtenerListaSorteoByFecha = async(req, res) => {
    const nameService = 'obtenerListaSorteoByFecha'
    const log = {
        layerMethod: {
            layer: fileName,
            method: nameService
        },
        messageInicio: `Inicio del servicio ${nameService}`,
        messageFin: `Fin del servicio ${nameService}`,
        messageError: `Error del servicio ${nameService}`,
        parametrosEntrada: {
            parameterHeaders: {
                ...req.headers
            }
        }
    }
    try {
        const {fechaInicio, fechaFin } = req.body
        const fecha1 = fechaInicio.replace(/-/g, '');
        const fecha2 = fechaFin.replace(/-/g, '');
        logger.writeInfoText(`${log.messageInicio}, ${JSON.stringify(req.body, null, 4)}`, { ...log.layerMethod });
        const listado = await obtenerListadaSorteoByFecha({fechaInicio: fecha1, fechaFin:fecha2 });
        res.json({
            status: 0,
            mensaje: 'success',
            data: listado
        })
    } catch (error) {
        logger.writeErrorText(`${log.messageError}`, { ...log.layerMethod });
        logger.writeExceptionLog(error, { ...log.layerMethod });
        res.json({
            status: 1,
            mensaje: (error.message) ? (error.message) : error,
            data: null
        })
    }
}

exports.obtenerDetalleSorteo = async(req, res) => {
    const nameService = 'obtenerDetalleSorteo'
    const log = {
        layerMethod: {
            layer: fileName,
            method: nameService
        },
        messageInicio: `Inicio del servicio ${nameService}`,
        messageFin: `Fin del servicio ${nameService}`,
        messageError: `Error del servicio ${nameService}`,
        parametrosEntrada: {
            parameterHeaders: {
                ...req.headers
            }
        }
    }
    try {
        const {idSorteo } = req.body
        let sorteoId = await desEncriptarIdSorteo({idSorteo});
        logger.writeInfoText(`${log.messageInicio}, ${JSON.stringify(req.body, null, 4)}`, { ...log.layerMethod });
        const sorteo = await obtenerDetalleSorteoById({ idSorteo: sorteoId });
        res.json({
            status: 0,
            mensaje: 'success',
            data: sorteo
        })
    } catch (error) {
        logger.writeErrorText(`${log.messageError}`, { ...log.layerMethod });
        logger.writeExceptionLog(error, { ...log.layerMethod });
        res.json({
            status: 1,
            mensaje: (error.message) ? (error.message) : error,
            data: null
        })
    }
}
exports.registrarTicket = async(req, res) => {
    semaforo.take(async function() {

        const nameService = 'registrarTicket'
        const log = {
            layerMethod: {
                layer: fileName,
                method: nameService
            },
            messageInicio: `Inicio del servicio ${nameService}`,
            messageFin: `Fin del servicio ${nameService}`,
            messageError: `Error del servicio ${nameService}`,
            parametrosEntrada: {
                parameterHeaders: {
                    ...req.headers
                }
            }
        }
        try {
            const {idSorteo, carnetIdentidad, cantidadTicket, nombreCompleto, codePais, nroCelular, correo, idTipoPago } = req.body
            let idSorteoDesEncrip = await desEncriptarIdSorteo({idSorteo});
            logger.writeInfoText(`${log.messageInicio}, ${JSON.stringify(req.body, null, 4)}`, { ...log.layerMethod });
            const sorteo = await registrarTickets({ idSorteo: idSorteoDesEncrip, carnetIdentidad, cantidadTicket, nombreCompleto, codePais, nroCelular, correo, idTipoPago});
            semaforo.leave();
            res.json({
                status: 0,
                mensaje: 'success',
                data: sorteo
            })
        } catch (error) {
            logger.writeErrorText(`${log.messageError}`, { ...log.layerMethod });
            logger.writeExceptionLog(error, { ...log.layerMethod });
            semaforo.leave();
            res.json({
                status: 1,
                mensaje: (error.message) ? (error.message) : error,
                data: null
            })
        }
    });
}
exports.obtenerDetalleTicketsById = async(req, res) => {
    const nameService = 'obtenerDetalleTicketsById'
    const log = {
        layerMethod: {
            layer: fileName,
            method: nameService
        },
        messageInicio: `Inicio del servicio ${nameService}`,
        messageFin: `Fin del servicio ${nameService}`,
        messageError: `Error del servicio ${nameService}`,
        parametrosEntrada: {
            parameterHeaders: {
                ...req.headers
            }
        }
    }
    try {
        const {idSorteo, idEstadoPago } = req.body
  
        logger.writeInfoText(`${log.messageInicio}, ${JSON.stringify(req.body, null, 4)}`, { ...log.layerMethod });
        const detalle = await obtenerTicketsByIdSorteo({ idSorteo, idEstadoPago });
        res.json({
            status: 0,
            mensaje: 'success',
            data: detalle
        })
    } catch (error) {
        logger.writeErrorText(`${log.messageError}`, { ...log.layerMethod });
        logger.writeExceptionLog(error, { ...log.layerMethod });
        res.json({
            status: 1,
            mensaje: (error.message) ? (error.message) : error,
            data: null
        })
    }
}

exports.listaDetalleClienteXSorteo = async(req, res) => {
    const nameService = 'listaDetalleClienteXSorteo'
    const log = {
        layerMethod: {
            layer: fileName,
            method: nameService
        },
        messageInicio: `Inicio del servicio ${nameService}`,
        messageFin: `Fin del servicio ${nameService}`,
        messageError: `Error del servicio ${nameService}`,
        parametrosEntrada: {
            parameterHeaders: {
                ...req.headers
            }
        }
    }
    try {
        const {idSorteo } = req.body

        logger.writeInfoText(`${log.messageInicio}, ${JSON.stringify(req.body, null, 4)}`, { ...log.layerMethod });
        const listado = await obtenerDetalleClienteXSorteo({idSorteo });
        res.json({
            status: 0,
            mensaje: 'success',
            data: listado
        })
    } catch (error) {
        logger.writeErrorText(`${log.messageError}`, { ...log.layerMethod });
        logger.writeExceptionLog(error, { ...log.layerMethod });
        res.json({
            status: 1,
            mensaje: (error.message) ? (error.message) : error,
            data: null
        })
    }
}

exports.listaDetalleSorteoCienteId = async(req, res) => {
    const nameService = 'listaDetalleSorteoCienteId'
    const log = {
        layerMethod: {
            layer: fileName,
            method: nameService
        },
        messageInicio: `Inicio del servicio ${nameService}`,
        messageFin: `Fin del servicio ${nameService}`,
        messageError: `Error del servicio ${nameService}`,
        parametrosEntrada: {
            parameterHeaders: {
                ...req.headers
            }
        }
    }
    try {
        const {idSorteo, idClienteTemporal } = req.body

        logger.writeInfoText(`${log.messageInicio}, ${JSON.stringify(req.body, null, 4)}`, { ...log.layerMethod });
        const listado = await obtenerDetalleSorteoClienteID({idSorteo, idClienteTemporal });
        res.json({
            status: 0,
            mensaje: 'success',
            data: listado
        })
    } catch (error) {
        logger.writeErrorText(`${log.messageError}`, { ...log.layerMethod });
        logger.writeExceptionLog(error, { ...log.layerMethod });
        res.json({
            status: 1,
            mensaje: (error.message) ? (error.message) : error,
            data: null
        })
    }
}