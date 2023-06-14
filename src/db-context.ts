import { NodeEnvType } from './config'
import { Dialect, Sequelize } from 'sequelize'
import { Logger } from 'winston'
import Provider from './provider'
import { ServerError } from './utils/errors'

export default class DbContext {
    private logger: Logger
    sequelize: Sequelize

    constructor(provider: Provider) {
        this.logger = provider.logger.child({ childLabel: 'DbContext' })
        const config = provider.config

        this.sequelize = new Sequelize(config.dbName, config.dbUsername, config.dbPassword, {
            dialect: config.dbDialect as Dialect,
            host: config.dbHost,
            port: config.dbPort,
            logging: config.nodeEnv !== NodeEnvType.Test,
        })
    }

    checkConnection = async (): Promise<boolean> => {
        try {
            await this.sequelize.authenticate()
            this.logger.info('Database Connected')
            return true
        } catch (e) {
            throw new ServerError('Unable to connect to the database')
        }
    }
}
