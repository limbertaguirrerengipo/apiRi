
    const fileName = `${__filename.substring(__dirname.length + 1, __filename.lastIndexOf('.'))}`;
    const moment = require('moment');
    const { fn } = require('sequelize');
    const env = process.env.NODE_ENV || 'development';
    const { encrypt, decrypt } = require('../midlwares/encrypt')
    const Logger = require('../logger');
    let logger = new Logger.Logger();
    const configJson = require('../config/app.json')[env];
 
    const {
        ESTADO_SOLICITUD,
        ESTADO_PAGO,
        TIPO_PAGO
    }  = require('../lib/constantes');

    const enviarMensaje = async({tickets,extension, nroCelular, titulo, descripcion}) => {
        const nombre = 'enviarMensaje'
        const log = {
            layerMethod: {
                layer: fileName,
                method: nombre
            },
            messageInicio: `Inicio de la funcion ${nombre}`,
            messageFin: `Fin de la funcion ${nombre}`,
            messageError: `Error de la funcion ${nombre}`,
            parametrosEntrada: {
                
            }
        }
        try {
            logger.writeInfoText(`${log.messageInicio}, parametros: ${JSON.stringify({...log.parametrosEntrada}, null, 4)}`, { ...log.layerMethod });
            let celularCode = extension.replace(/\+/g, '') + nroCelular;
            const texto = await armarTextoWpp({ tickets, titulo, descripcion });
            await sendWapp({
                numero:celularCode,
                mensaje: texto
            });
       
        } catch (error) {
            logger.writeErrorText(`${log.messageError}, error: ${JSON.stringify(error, null, 4)}`, { ...log.layerMethod });
            logger.writeExceptionLog(error, { ...log.layerMethod });
           return  { error };
        }
    }
    const armarTextoWpp = ({tickets, titulo, descripcion})=>{
        const cadena = tickets.map(item => `\\n• ${item.idTicket}`).join('');
       
        let mensaje = `*${titulo}* \\n ${descripcion} \\n\\n Nro de tickets:${cadena}`;
        return mensaje
    }

    const sendWapp = async ({numero, mensaje}) => {
        try {
            var axios = require('axios');
            var qs = require('qs');
            var data = qs.stringify({
                "token": configJson.wpp.token,
                "to": numero,
                "body": mensaje,
                "priority": 1,
                "referenceId": "",
                "msgId": "",
                "mentions": ""
            });
            
            var config = {
              method: 'post',
              url:configJson.wpp.url,
              headers: {  
                'Content-Type': 'application/x-www-form-urlencoded'
              },
              data : data
            };
            
          const respon = await  axios(config);
          console.log(JSON.stringify(respon.data));

        } catch (error) {
          console.error('Error al enviar el mensaje:', error);
        }
      };
module.exports = {
    enviarMensaje
}
