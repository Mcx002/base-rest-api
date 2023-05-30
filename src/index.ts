import express, {Express} from 'express';
import cors, {CorsOptions} from 'cors';
import EnvConfiguration, {NodeEnvType} from './config';
import winston, {Logger} from 'winston';
import Provider from './provider';
import Controller from './server/controllers';
import Service from './server/services';
import Model from './server/models';
import Repository from './server/repositories';

export type BootResult = {
    app: Express,
    config: EnvConfiguration,
    logger: Logger
}

function createLogger(config: EnvConfiguration): winston.Logger {
    return winston.createLogger({
        defaultMeta: { mainLabel: 'Main' },
        format: winston.format.combine(
            winston.format.colorize(),
            winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
            winston.format.printf(({ message, timestamp, level, mainLabel, childLabel }) => {
                return `${timestamp} [${level}] (${mainLabel}${childLabel ? ' | ' + childLabel : ''}): ${message}`;
            })
        ),
        transports: [
            new winston.transports.Console({
                level: config.nodeEnv === NodeEnvType.Test ? 'error' : 'info',
            }),
        ],
    })
}

export async function boot(): Promise<BootResult> {
    // Prepare Configuration
    const config = new EnvConfiguration()

    // Prepare logger
    const logger = createLogger(config)

    logger.info('Booting...')

    // Prepare Dependencies Injection
    const provider = new Provider(config, logger)
    logger.info('Dependencies Injection Has Been Created')

    // Prepare DB
    logger.info('Connecting to DB')
    const model = new Model(provider)
    // Will be throw error once got error
    await model.dbContext.checkConnection()

    // Setting Up Controller
    const repository = new Repository(provider)
    const service = new Service(provider)
    const controller = new Controller(provider)

    // Reassign providers
    provider.repository = repository
    provider.service = service
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
    app.use('/', await controller.getRouters())
    logger.info('Express has been Set')

    logger.info('Booting Completed')
    return {
        app,
        config,
        logger
    }
}
async function main() {
    const {app, config, logger} = await boot()

    app.listen(config.port, () => logger.info(`Server is Running on PORT: ${config.port}`))
}

main()
    .catch((e) => console.error(e))