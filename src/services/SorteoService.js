const constructorSorteoService = ({logger}) => { 
    const fileName = `${__filename.substring(__dirname.length + 1, __filename.lastIndexOf('.'))}`;
    const {
        registrarSorteoRepo,
        ActualizarSorteo,
        obtenerSorteoById
    } = require('../repositorio/SorteoRepositorio');
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
                return regis
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
    return {
        registrarSorteo,
        ActualizarEstadoSorteo
    }
} 


module.exports = {
    constructorSorteoService
}
