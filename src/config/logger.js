const winston = require("winston")
const config = require("./config")

const enumerateErrorFormat = winston.format((info) => {
    if (info instanceof Error) {
        Object.assign(info,{ message : info.stack})
    }
    return info
})


const logger = winston.createLogger({
    level: config.env === 'development' ? 'debug' : 'info',
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        enumerateErrorFormat(),
        config.env === 'development' ? winston.format.colorize() : winston.format.uncolorize(),
        winston.format.splat(),
        winston.format.printf(({ timestamp, level, message }) => `${timestamp} ${level}: ${message}`)
    ),
    transports: [
        new winston.transports.Console({
            stderrLevels: ['error'] 
        }),
        new winston.transports.File({
            filename: 'app.log',
            level: 'info',
            format: winston.format.combine(
                winston.format.uncolorize(),
                winston.format.json()
            )
        })
    ],
    exceptionHandlers: [
        new winston.transports.File({ filename : 'exceptions.log'})
    ]
})

winston.exceptions.handle(
    new winston.transports.File({ filename: 'exceptions.log' })
  );
module.exports = logger;
  