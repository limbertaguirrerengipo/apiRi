const constructorAprobacionFuncionarioService = ({logger}) => { 
    const fileName = `${__filename.substring(__dirname.length + 1, __filename.lastIndexOf('.'))}`;
    const {obtenerSolicitantesPorAprobador} = require('../repositorio/AprobacionFuncionarioRepository');
    
    const obtenerSolicitante = async({IdEmpleadoAprobador}) => {
        const nombre = 'obtenerSolicitante'
        const log = {
            layerMethod: {
                layer: fileName,
                method: nombre
            },
            messageInicio: `Inicio de la funcion ${nombre}`,
            messageFin: `Fin de la funcion ${nombre}`,
            messageError: `Error de la funcion ${nombre}`,
            parametrosEntrada: {
                IdEmpleadoAprobador
            }
            
        }
        try {
            logger.writeInfoText(`${log.messageInicio}, parametros: ${JSON.stringify({...log.parametrosEntrada}, null, 4)}`, { ...log.layerMethod });
            return await obtenerSolicitantesPorAprobador({IdEmpleadoAprobador})
        } catch (error) {
            logger.writeErrorText(`${log.messageError}, error: ${JSON.stringify(error, null, 4)}`, { ...log.layerMethod });
            logger.writeExceptionLog(error, { ...log.layerMethod });
            throw(error);
        }
    }
    
    return {
        obtenerSolicitante
    }
} 


module.exports = {
    constructorAprobacionFuncionarioService
}
