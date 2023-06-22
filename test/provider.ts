import { createLoggerTest } from './logger'
import EnvConfiguration from '../src/config'
import Provider from '../src/provider'
import { initProvider } from '../src/boot'

export const createProviderTest = (): Provider => {
    // Init logger
    const logger = createLoggerTest()

    // Init environment configuration
    const config = new EnvConfiguration()

    // Prepare provider
    const provider = new Provider(config, logger)

    initProvider(provider)

    return provider
}
