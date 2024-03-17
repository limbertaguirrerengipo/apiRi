const fileName = `${__filename.substring(__dirname.length + 1, __filename.lastIndexOf('.'))}`;
 const Logger = require('../logger');
 let logger = new Logger.Logger();

 exports.login = async(req, res) => {
    const nameService = 'login'
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
      //  const {usuario, password} = req.headers
        res.json({
            status: 0,
            mensaje: 'success',
            data: {
                userName: "Maria99",
                carnet: '5361144',
                token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c3VhX2lkIjoiNzc0ODQ5NiIsInVzZXJuYW1lIjoiQ1JVWiBPU0lOQUdBIENSSVNUSElBTiBKT0VMIiwiZXN0YWRvIjoxLCJ0aXBvIjoyLCJpZF9hZmlsaWFkbyI6NzY2MywiZG9jaWQiOiI3NzQ4NDk2IiwiaWF0IjoxNjg5MjY5Mjk5LCJleHAiOjE2ODkzNTU2OTl9.cNf4yP5lUL3OuUq9ypRhBoEa9G3B9q5NgG6a7GFFldE",
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