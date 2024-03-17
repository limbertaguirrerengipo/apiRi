const constructorSorteoService = ({logger}) => { 
    const fileName = `${__filename.substring(__dirname.length + 1, __filename.lastIndexOf('.'))}`;
    const {registrarSorteoRepo} = require('../repositorio/SorteoRepositorio');
    const dbAdministrativoFlujoConection = require('../models/dbRifa/dbAdministrativoFlujoConection')
    
    const registrarSorteo = async({titulo,cantidadTicket, precioUnitario, idMoneda, descripcion}) => {
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
                titulo,cantidadTicket, precioUnitario, idMoneda, descripcion
            }
            
        }
        try {
            logger.writeInfoText(`${log.messageInicio}, parametros: ${JSON.stringify({...log.parametrosEntrada}, null, 4)}`, { ...log.layerMethod });
            const transaccionProcesada = await dbAdministrativoFlujoConection.transaction(async(t) => {
            const regis = await registrarSorteoRepo({titulo,cantidadTicket, precioUnitario, idMoneda, descripcion},{transaction : t});
            });
            return transaccionProcesada;
        } catch (error) {
            
            
            logger.writeErrorText(`${log.messageError}, error: ${JSON.stringify(error, null, 4)}`, { ...log.layerMethod });
            logger.writeExceptionLog(error, { ...log.layerMethod });
            throw(error);
        }
    }
    
    return {
        registrarSorteo
    }
} 


module.exports = {
    constructorSorteoService
}
