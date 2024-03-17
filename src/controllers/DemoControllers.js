//aqui van los controladores
const fileName = `${__filename.substring(__dirname.length + 1, __filename.lastIndexOf('.'))}`;
 const Logger = require('../logger');
 let logger = new Logger.Logger();
 const {constructorAprobacionFuncionarioService} = require('../services/AprobacionFuncionarioService');
 const {obtenerSolicitante} = constructorAprobacionFuncionarioService({logger});

 exports.obtenerSolicitante = async(req, res) => {
    const nombre = 'obtenerSolicitante'
    const log = {
        layerMethod: {
            layer: fileName,
            method: nombre
        },
        messageInicio: `Inicio del servicio ${nombre}`,
        messageFin: `Fin del servicio ${nombre}`,
        messageError: `Error del servicio ${nombre}`,
        parametrosEntrada: {
            parameterHeaders: {
                ...req.headers
            },
            parameterBody: {
            }
        }
        
    }
    try {
        logger.writeInfoText(`${log.messageInicio}, ${JSON.stringify(log.parametrosEntrada, null, 4)}`, { ...log.layerMethod });
        const {idempleadoaprobador} = req.headers
        const respuesta = await obtenerSolicitante({IdEmpleadoAprobador: idempleadoaprobador});
        logger.writeInfoText(`${log.messageFin}, ${JSON.stringify(log.parametrosEntrada, null, 4)}`, { ...log.layerMethod });
        res.json({
            status: 0,
            mensaje: 'No hay Errores',
            data: respuesta
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