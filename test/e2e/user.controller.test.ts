import request from 'supertest'
import EnvConfiguration from '../../src/config'
import { afterEach, beforeEach } from '@jest/globals'
import { UserCreationAttributes } from '../../src/server/models/user.model'
import RepositoryProvider from '../../src/server/repositories'
import Provider from '../../src/provider'
import { createLoggerTest } from '../logger'
import ModelProvider from '../../src/server/models'
import { boot } from '../../src/boot'
import * as http from 'http'

describe('User Controller E2E Test', () => {
    let server: http.Server
    beforeEach(async () => {
        const settings = await boot()
        server = settings.app.listen(settings.config.port)
    })
    afterEach(() => {
        server.close()
    })
    test('[/users/:xid] Should Get User Detail', async () => {
        const config = new EnvConfiguration()

        const logger = createLoggerTest()

        // Prepare Dependencies Injection
        const provider = new Provider(config, logger)

        const db = new ModelProvider(provider)
        const connected = await db.dbContext.checkConnection()

        expect(connected).toBe(true)

        const repository = new RepositoryProvider()
        repository.init(provider)

        const row: UserCreationAttributes = {
            xid: 'F89JDO',
            name: 'Agung',
            email: 'agung@gmail.com',
        }

        const data = await repository.userRepository.insert(row)

        expect(data).toMatchObject(row)

        const res = await request(server).get(`/users/${data.xid}`)
        expect(res.statusCode).toEqual(200)
        expect(res.body).toHaveProperty('data')
        expect(res.body.data).toMatchObject(row)

        await repository.userRepository.deleteById(data.id)
    })
})
