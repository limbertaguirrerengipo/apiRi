const fileName = `${__filename.substring(__dirname.length + 1, __filename.lastIndexOf('.'))}`;
 const Logger = require('../logger');
 let logger = new Logger.Logger();
 let env = process.env.NODE_ENV || 'development';
 const jwt = require('jsonwebtoken');
 const envVars = require('../config/envVars.json')[ env ];

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
        const {usuario, password} = req.headers
        if (usuario !== 'admin' || password !=='admin164'){ 
           throw new Error('login incorrecto')
        }
         const user = {
            id: 123,
            carnet: '00000011',
            username: 'admin'
          };
          const expiresIn = '1h'; // Tiempo de expiración del token (1 hora en este ejemplo)
          // Generar el token
          const token = jwt.sign(user, envVars.JWT_SECRET, { expiresIn });

        res.json({
            status: 0,
            mensaje: 'success',
            data: {
                userName: user.username,
                carnet: user.carnet,
                token: token
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