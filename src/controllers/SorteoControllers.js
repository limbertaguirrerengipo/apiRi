const fileName = `${__filename.substring(__dirname.length + 1, __filename.lastIndexOf('.'))}`;
const Logger = require('../logger');
let logger = new Logger.Logger();

const {constructorSorteoService} = require('../services/SorteoService');
const {registrarSorteo} = constructorSorteoService({logger});

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
        console.log('retorna')
        logger.writeInfoText(`${log.messageInicio}, ${JSON.stringify(log.parametrosEntrada, null, 4)}`, { ...log.layerMethod });
        const {titulo,cantidadTicket, precioUnitario, idMoneda, descripcion } = req.body
        const reg = await registrarSorteo({titulo,cantidadTicket, precioUnitario, idMoneda, descripcion });
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