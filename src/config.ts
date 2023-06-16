import { getEnvNumber, getEnvString } from './utils/env-parsers';

export enum NodeEnvType {
    Production = 'production',
    Development = 'development',
    Test = 'test',
}

export default class EnvConfiguration {
    // Service Environment
    nodeEnv = getEnvString('NODE_ENV', NodeEnvType.Development)
    port = getEnvNumber('PORT', 3000)

    // App Environment
    appName = getEnvString('APP_NAME', '')
    appVersion = getEnvString('APP_VERSION', '')

    // Database Configuration
    dbName = getEnvString('DB_NAME')
    dbUsername = getEnvString('DB_USERNAME')
    dbPassword = getEnvString('DB_PASSWORD')
    dbDialect = getEnvString('DB_DIALECT', 'postgres')
    dbHost = getEnvString('DB_HOST', 'localhost')
    dbPort = getEnvNumber('DB_PORT', 5433)
}
