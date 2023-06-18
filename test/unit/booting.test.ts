import winston from 'winston'
import EnvConfiguration from '../../src/config'
import Provider from '../../src/provider'
import ControllerProvider from '../../src/server/controllers'
import ServiceProvider from '../../src/server/services'
import RepositoryProvider from '../../src/server/repositories'
import { createLoggerTest } from '../logger'

describe('Booting Test', () => {
    let config: EnvConfiguration
    beforeAll(() => {
        config = new EnvConfiguration()
    })
    test('Logger is Defined', () => {
        // Init logger
        const logger = winston.createLogger({
            format: winston.format.cli(),
            transports: [new winston.transports.Console()],
        })

        // expect logger defined
        expect(logger).toBeDefined()
    })

    test('Env Configuration Can Be Loaded', () => {
        // Expect config is match with certain object
        expect(config).toMatchObject({
            nodeEnv: 'test',
        })
    })

    test('Dependencies Injection Working Well', () => {
        // Init logger
        const logger = createLoggerTest()

        // Prepare provider
        const provider = new Provider(config, logger)

        // expected config and logger to be defined and undefined for controller
        expect(provider.config).toBeDefined()
        expect(provider.logger).toBeDefined()
        expect(provider.controller).toBeUndefined()

        // Set up providers
        provider.repository = new RepositoryProvider()
        provider.service = new ServiceProvider()
        provider.controller = new ControllerProvider()

        // Init Providers
        provider.repository.init(provider)
        provider.service.init(provider)
        provider.controller.init(provider)

        // Expected provider has defined controller
        expect(provider.controller).toBeDefined()
        expect(provider.controller.provider.config).toMatchObject(provider.service.provider.config)
    })
})
