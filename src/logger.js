const { createLogger, format, transports } = require("winston") ;
const winstonDailyRotateFile = require('winston-daily-rotate-file');
const fs = require('fs');
const path = require('path');

const LOGS_DIR = path.dirname(__dirname) + '/logs';

const LEVELS = {
    error: 'error',
    info: 'info',
    warning: 'warn',
    emerge: 'emerge',
    critical: 'crit',
    notice: 'notice',
    debug: 'debug',
    alert: 'alert',
};

if (!fs.existsSync(LOGS_DIR)) {
    fs.mkdirSync(LOGS_DIR);
}

class Logger {
    transactionId;

    constructor() {
        this.transactionId = new Date().getTime().toString();
    }

    _getLogger({ level = LEVELS.info, logPath, message }) {
        return createLogger({
            level,
            message,
            format: format.combine(
                format.timestamp({
                    format: 'YYYY-MM-DD HH:mm:ss',
                }),
                format.printf((lev) => `${lev.timestamp} ${lev.level} - ${this.transactionId}: ${lev.message}`)
            ),
            transports: [
                new transports.Console({
                    level,
                    format: format.combine(
                        format.colorize(),
                        format.printf((lev) => `${lev.timestamp} ${lev.level} - ${this.transactionId}: ${lev.message}`)
                    ),
                }),
                new transports.DailyRotateFile({
                    filename: `${LOGS_DIR}/${logPath}/LOG_%DATE%.log`,
                    datePattern: 'YYYY-MM-DD',
                }),
            ],
        });
    }

    _writeTextLog({ level = LEVELS.info, logPath = 'general', message }) {
    this._getLogger({ level, logPath, message })[level](message);
    }

    _writeJsonLog({ level = LEVELS.info, logPath = 'general', json }) {
        const jsonStr = JSON.stringify(json, null, 2);
        this._getLogger({ level, logPath, message: jsonStr })[level](jsonStr);
    }

    writeInfoText(message, {layer, method}) {
        console.log(`message: ${message}, layer: ${layer}, method: ${method}`);
        let newMessage = (layer && method) ? `${layer} > ${method} > ${message}` : message;
        //let message = 'AdministrativoControllers > buscarFuncionarios';
        this._writeTextLog({ level: LEVELS.info, message: newMessage });
    }

    writeErrorText(message, {layer, method}) {
        let newMessage = (layer && method) ? `${layer} > ${method} > ${message}` : message;
        this._writeTextLog({ level: LEVELS.error, message: newMessage });
    }

    writeErrorJson(json) {
        this._writeJsonLog({ level: LEVELS.error, json });
    }

    writeInfoJson(json) {
        this._writeJsonLog({ level: LEVELS.info, json });
    }

    writeExceptionLog(error, {layer, method}) {
        this.writeErrorText((error.message) ? error.message : error, {layer, method});
        this.writeErrorText((error.stack) ? error.stack : error, {layer, method});
    }
}

//export default Logger;
module.exports = {
    Logger
}
