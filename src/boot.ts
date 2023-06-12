import express, { Express } from 'express'
import EnvConfiguration, { NodeEnvType } from './config'
import winston, { Logger } from 'winston'
import Provider from './provider'
import ModelProvider from './server/models'
import RepositoryProvider from './server/repositories'
import ServiceProvider from './server/services'
import ControllerProvider from './server/controllers'
import cors, { CorsOptions } from 'cors'

export type BootResult = {
    app: Express
    config: EnvConfiguration
    logger: Logger
}

export function createLogger(config?: EnvConfiguration): winston.Logger {
    return winston.createLogger({
        defaultMeta: { mainLabel: 'Main' },
        format: winston.format.combine(
            winston.format.colorize(),
            winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
            winston.format.printf(({ message, timestamp, level, mainLabel, childLabel }) => {
                return `${timestamp} [${level}] (${mainLabel}${childLabel ? ' | ' + childLabel : ''}): ${message}`
            })
        ),
        transports: [
            new winston.transports.Console({
                level: config?.nodeEnv === NodeEnvType.Test ? 'error' : 'info',
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
    const model = new ModelProvider(provider)
    // Will be throw error once got error
    await model.dbContext.checkConnection()

    // Setting Up providers
    provider.repository = new RepositoryProvider()
    provider.service = new ServiceProvider()
    provider.controller = new ControllerProvider()

    // Initiate providers
    provider.repository.init(provider)
    provider.service.init(provider)
    provider.controller.init(provider)

    // Setting Up Cors Option
    const costOptions: CorsOptions = {
        origin: '*',
        methods: 'GET,POST,OPTIONS,PUT,DELETE,PATCH',
    }
    logger.info('CORS Option has been Set')

    // Setting Up express
    const app = express()
    app.use(cors(costOptions))
    app.use('/', await provider.controller.getRouters())
    logger.info('Express has been Set')

    logger.info('Booting Completed')
    return {
        app,
        config,
        logger,
    }
}
