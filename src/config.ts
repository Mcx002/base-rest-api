import dotenv from 'dotenv'
import path from 'path'

export enum NodeEnvType {
    Production = 'production',
    Development = 'development',
    Test = 'test',
}

dotenv.config({ path: path.join(process.cwd(), `.env${process.env.NODE_ENV === NodeEnvType.Test ? '.test' : ''}`) })

export default class EnvConfiguration {
    public nodeEnv: string
    public port: number

    public appName: string
    public appVersion: string

    public dbName: string
    public dbUsername: string
    public dbPassword: string
    public dbDialect: string
    public dbHost: string
    public dbPort: number
    constructor() {
        // Service Environment
        this.nodeEnv = process.env['NODE_ENV'] ?? NodeEnvType.Development
        this.port = parseInt(process.env['PORT'] ?? '3000')

        // App Environment
        this.appName = process.env['APP_NAME'] ?? ''
        this.appVersion = process.env['APP_VERSION'] ?? ''

        // Database Configuration
        this.dbName = process.env['DB_NAME']!
        this.dbUsername = process.env['DB_USERNAME']!
        this.dbPassword = process.env['DB_PASSWORD']!
        this.dbDialect = process.env['DB_DIALECT'] ?? 'postgres'
        this.dbHost = process.env['DB_HOST'] ?? 'localhost'
        this.dbPort = parseInt(process.env['DB_PORT'] ?? '5433')
    }
}
