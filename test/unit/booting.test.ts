import winston from 'winston';
import EnvConfiguration from '../../src/config';
import Provider from '../../src/provider';
import ControllerProvider from '../../src/server/controllers';

describe('Booting Test', () => {
    test('Logger is Defined', () => {
        // Init logger
        const logger = winston.createLogger({
            format: winston.format.cli(),
            transports: [
                new winston.transports.Console(),
            ],
        })

        // expect logger defined
        expect(logger).toBeDefined()
    })

    test('Env Configuration Can Be Loaded', () => {
        // Init environment configuration
        const config = new EnvConfiguration()

        // Expect config is match with certain object
        expect(config).toMatchObject({
            nodeEnv: 'test',
        })
    })

    test('Dependencies Injection Working Well', () => {
        // Init logger
        const logger = winston.createLogger({
            format: winston.format.cli(),
            transports: [
                new winston.transports.Console(),
            ],
        })

        // Init environment configuration
        const config = new EnvConfiguration()

        // Prepare provider
        const provider = new Provider(config, logger)

        // expected config and logger to be defined and undefined for controller
        expect(provider.config).toBeDefined()
        expect(provider.logger).toBeDefined()
        expect(provider.controller).toBeUndefined()

        // Init controller
        provider.controller = new ControllerProvider(provider)

        // Expected provider has defined controller
        expect(provider.controller).toBeDefined()
    })
})