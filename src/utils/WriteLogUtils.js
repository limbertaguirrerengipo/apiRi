const Logger = require('../logger');
let logger = new Logger.Logger();
exports.CONSTANTE = {
    INICIO_SERVICIO:'Inicio de servicio',
    FIN_SERVICIO:'Fin de servicio',
    INICIO_METODO:'Inicio de metodo',
    FIN_METODO:'Fin de metodo',
    ERROR_SERVICIO: 'Error en el servicio'
}
 
exports.WriteLog =({fileName,nombreMetodo,descripcion, data} )=>{
    const log = {
        layerMethod: {
            layer: fileName,
            method: nombreMetodo
        },
        descripcion,
        parametrosEntrada: data
    }
    logger.writeInfoText(`${log.descripcion}, ${JSON.stringify(log.parametrosEntrada, null, 4)}`, { ...log.layerMethod });
}

exports.WriteLogError = ({error, fileName, nombreMetodo}) => {
    const layerMethod = {
            layer: fileName,
            method: nombreMetodo
        }
    const mensaje = JSON.stringify({
        error: (error.message) ? error.message : error,
        stack: (error.stack) ? error.stack : error 
    })
    logger.writeErrorText(mensaje, ...layerMethod); 
}