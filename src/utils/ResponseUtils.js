const responseService = ({respuesta, mensajeErrorUsuario}) => {
    return {
        status: (respuesta) ? 0 : 1,
        mensaje: (respuesta) ? 'No hay Errores' : mensajeErrorUsuario,
        data: respuesta
    }
}

const responseErrorService = ({error}) => {
    return {
        status: 1,
        mensaje: (error.message) ? (error.message) : error,
        data: null
    }
}

module.exports = {
    responseService,
    responseErrorService
}