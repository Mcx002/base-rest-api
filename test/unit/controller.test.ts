import ControllerProvider from '../../src/server/controllers'
import Provider from '../../src/provider'
import winston from 'winston'
import EnvConfiguration from '../../src/config'
import { beforeEach, expect } from '@jest/globals'
import RepositoryProvider from '../../src/server/repositories'
import ServiceProvider from '../../src/server/services'
import { createLoggerTest } from '../logger'

describe('Controller Test', () => {
    let logger: winston.Logger
    let config: EnvConfiguration
    let provider: Provider
    let controller: ControllerProvider
    beforeEach(() => {
        // Init logger
        logger = createLoggerTest()

        // Init environment configuration
        config = new EnvConfiguration()

        // Prepare provider
        provider = new Provider(config, logger)

        // Init controller
        provider.repository = new RepositoryProvider(provider)
        provider.service = new ServiceProvider(provider)
        controller = new ControllerProvider(provider)
    })

    test('Do Provider Injected', () => {
        // Expected healthController has provider same with initiated
        expect(controller.provider.config).toEqual(provider.config)
    })
})
