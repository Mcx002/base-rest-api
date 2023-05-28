import dotenv from 'dotenv'
import path from 'path';

enum NodeEnvType {
    Production = 'production',
    Development = 'development',
    Test = 'test'
}

dotenv.config({ path: path.join(process.cwd(), `.env${((process.env.NODE_ENV === NodeEnvType.Test) ? '.test' : '')}`) });

export default class EnvConfiguration {
    public nodeEnv: string
    public port: number

    public appName: string
    constructor() {
        this.nodeEnv = process.env['NODE_ENV'] ?? NodeEnvType.Development
        this.port = parseInt(process.env['PORT'] ?? '') ?? 3000

        this.appName = process.env['APP_NAME'] ?? ''
    }
}