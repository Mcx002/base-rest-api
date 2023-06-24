import express, { Express } from 'express'
import EnvConfiguration, { NodeEnvType } from './config'
import winston, { Logger } from 'winston'
import Provider from './provider'
import ModelProvider from './server/models'
import cors, { CorsOptions } from 'cors'
import RepositoryProvider from './server/repositories'
import ServiceProvider from './server/services'
import ControllerProvider from './server/controllers'

export type BootResult = {
    app: Express
    config: EnvConfiguration
    logger: Logger
}

export const initProvider = (provider: Provider) => {
    // Init Provider
    provider.repository = new RepositoryProvider()
    provider.service = new ServiceProvider()
    provider.controller = new ControllerProvider()

    // Initiate providers
    provider.repository.init(provider)
    provider.service.init(provider)
    provider.controller.init(provider)
}

export function createMainLogger(logLevel: string): winston.Logger {
    return winston.createLogger({
        defaultMeta: { mainLabel: 'Main' },
        level: logLevel,
        format: winston.format.combine(
            winston.format.colorize(),
            winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
            winston.format.printf(({ message, timestamp, level, mainLabel, childLabel }) => {
                return `${timestamp} [${level}] (${mainLabel}${childLabel ? ' | ' + childLabel : ''}): ${message}`
            })
        ),
        transports: [new winston.transports.Console()],
    })
}

export function getLogLevel(nodeEnv: string): string {
    return nodeEnv === NodeEnvType.Test ? 'error' : 'info'
}

export async function boot(): Promise<BootResult> {
    // Prepare Configuration
    const config = new EnvConfiguration()

    // Prepare logger
    const logger = createMainLogger(getLogLevel(config.nodeEnv))

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
    initProvider(provider)

    // Setting Up Cors Option
    const costOptions: CorsOptions = {
        origin: config.corsOrigin,
        methods: 'GET,POST,OPTIONS,PUT,DELETE,PATCH',
    }
    logger.info('CORS Option has been Set')

    // Setting Up express
    const app = express()
    app.use(express.json())
    app.disable('x-powered-by')
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
