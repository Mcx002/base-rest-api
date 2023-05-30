import ControllerProvider from '../../src/server/controllers';
import Provider from '../../src/provider';
import winston from 'winston';
import EnvConfiguration from '../../src/config';
import {beforeEach, expect} from '@jest/globals';

describe('Controller Test', () => {
    let logger: winston.Logger
    let config: EnvConfiguration
    let provider: Provider
    let controller: ControllerProvider
    beforeEach(() => {
        // Init logger
        logger = winston.createLogger({
            format: winston.format.cli(),
            transports: [
                new winston.transports.Console(),
            ],
        })

        // Init environment configuration
        config = new EnvConfiguration()

        // Prepare provider
        provider = new Provider(config, logger)

        // Init controller
        controller = new ControllerProvider(provider)
    })

    test('Do Provider Injected', () => {
        // Expected healthController has provider same with initiated
        expect(controller.healthController.provider).toEqual(provider)

        // assign controller to provider
        provider.controller = controller

        // Expected healthController has updated provider same with the root
        expect(controller.healthController.provider).toEqual(provider)
    })
})