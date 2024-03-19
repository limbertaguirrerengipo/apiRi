const fileName = `${__filename.substring(__dirname.length + 1, __filename.lastIndexOf('.'))}`;
const Logger = require('../logger');
let logger = new Logger.Logger();

const {constructorSorteoService} = require('../services/SorteoService');
const {
    registrarSorteo,
    ActualizarEstadoSorteo,
    EliminarSorteoByID,
    obtenerListadaSorteoByFecha,
    obtenerDetalleSorteoById
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
        //desencriptar idSorteo, implementarr
        let sorteoId = idSorteo;
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