import express, {Express} from 'express';
import cors, {CorsOptions} from 'cors';
import EnvConfiguration from './config';
import winston, {Logger} from 'winston';
import Provider from './provider';
import Controller from './server/controllers';

type BootResult = {
    app: Express,
    config: EnvConfiguration,
    logger: Logger
}

export function boot(): BootResult {
    // Prepare Configuration
    const config = new EnvConfiguration()

    // Prepare logger
    const logger = winston.createLogger({
        level: config.nodeEnv === 'test' ? '' : 'debug',
        format: winston.format.cli(),
        transports: [
            new winston.transports.Console(),
        ],
    })
    logger.info('Booting...')

    // Prepare Dependencies Injection
    const provider = new Provider({
        config,
        logger,
    })
    logger.info('Dependencies Injection Has Been Created')

    // Setting Up Controller
    const controller = new Controller(provider)

    provider.controller = controller

    // Setting Up Cors Option
    const costOptions: CorsOptions = {
        origin: '*',
        methods: 'GET,POST,OPTIONS,PUT,DELETE,PATCH',
    }
    logger.info('CORS Option has been Set')

    // Setting Up express
    const app = express()
    app.use(cors(costOptions))
    app.use('/', controller.getRouters())

    logger.info('Express has been Set')

    logger.info('Booting Completed')
    return {
        app,
        config,
        logger
    }
}
function main() {
    const {app, config, logger} = boot()

    app.listen(config.port, () => logger.info(`Server is Running on PORT: ${config.port}`))
}

main()