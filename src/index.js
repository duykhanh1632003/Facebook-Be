const config = require("./config/config")
const logger = require("./config/logger")
const app = require("./app")
const { default: mongoose } = require("mongoose")

let server
(async () => {
    try {
        await mongoose.connect(config.mongoose.url, config.mongoose.options)
        logger.info("Connected to mongoDB")
        server = app.listen(config.port, () => {
            logger.info(`Listening to port ${config.port}`);
        })
    } catch (error) {
        logger.error('Error connecting to MongoDB or starting the server:', error)
        process.exit(1)
    }
})()


const exitHandler = () => {
    if (server) {
        server.close(() => {
            logger.info('Server closed')
            process.exit(1)
        })
    }
    else {
        process.exit(1)
    }
}

const unexpectedErrorHandler = (error) => {
    logger.error(error)
    exitHandler()
}

process.on("uncaughtException", unexpectedErrorHandler)
process.on("unhandledRejection", unexpectedErrorHandler)

process.on('SIGTERM', () => {
    logger.info("SIGTERM received")
    if (server) {
        server.close()
    }
})
