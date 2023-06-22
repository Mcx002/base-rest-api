import request from 'supertest'
import EnvConfiguration from '../../src/config'
import { afterAll, beforeAll } from '@jest/globals'
import { UserAttributes, UserCreationAttributes } from '../../src/server/models/user.model'
import RepositoryProvider from '../../src/server/repositories'
import Provider from '../../src/provider'
import { createLoggerTest } from '../logger'
import ModelProvider from '../../src/server/models'
import { boot } from '../../src/boot'
import * as http from 'http'
import { createProviderTest } from '../provider'
import { handleError } from '../../src/server/constants/error.constant'
import { ServerError } from '../../src/utils/errors'
import { UserRepository } from '../../src/server/repositories/user.repository'
import { UserDto } from '../../src/dto/user.dto'

async function createUser(userForm: UserCreationAttributes, userRepository: UserRepository) {
    // Persist insert data
    let data: UserAttributes
    try {
        data = await userRepository.insert(userForm)
    } catch (e) {
        // error handlers
        handleError.uniqueConstraint(e, 'Failed to insert user data, please try again')

        // default error
        throw new ServerError('Failed to insert user data')
    }

    return data
}

describe('User Controller E2E Test', () => {
    let server: http.Server
    let provider: Provider
    beforeAll(async () => {
        const settings = await boot()
        server = settings.app.listen(settings.config.port)
        provider = createProviderTest()
    })
    afterAll(() => {
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

    test('[/users/:xid] Should not Found User Detail', async () => {
        const resErr = await request(server).get('/users/UNREGISTERED_XID')
        expect(resErr.statusCode).toEqual(400)
        expect(resErr.body.message).toBe('Resource Not Found')
        expect(resErr.body.data).toBeNull()
    })

    test('[/users] Should Error Unique Constraint', async () => {
        const { repository } = provider
        // Prepare insert value
        const userForm: UserCreationAttributes = {
            xid: 'AAA',
            name: 'Muchlish',
            email: 'muchlish@gmail.com',
        }

        // Persist insert data
        const data = await createUser(userForm, repository.userRepository)

        expect(data.xid).toBe(userForm.xid)

        await expect(async () => {
            await createUser(userForm, repository.userRepository)
        }).rejects.toThrowError(new ServerError('Failed to insert user data, please try again'))

        await repository.userRepository.deleteById(data.id)
    })

    test('[/users] Should Create User', async () => {
        const { repository } = provider
        const payload = {
            name: 'muchlish',
            email: 'muchlish@choeruddin.com',
        }
        const res = await request(server).post('/users').send(payload)
        expect(res.statusCode).toEqual(200)
        expect(res.body.message).toBe('OK')

        const data = res.body.data as UserDto

        expect(data.email).toBe(payload.email)

        const userAttr = await repository.userRepository.findByXid(data.xid)
        if (userAttr) {
            await repository.userRepository.deleteById(userAttr.id)
        }
    })

    test('[/users] Should Invalidate Payload', async () => {
        const payload: Partial<UserDto> = {
            email: 'muchlish@choeruddin.com',
        }
        const res = await request(server).post('/users').send(payload)
        expect(res.statusCode).toEqual(400)

        const payload2: Partial<UserDto> = {
            name: 'muchlish',
        }
        const res2 = await request(server).post('/users').send(payload2)
        expect(res2.statusCode).toEqual(400)
    })
    test('should throw a ServerError if the user data insertion fails', async () => {
        const { repository, service } = provider
        // Mock input data
        const payload = {
            name: 'muchlish',
            email: 'muchlish@choeruddin.com',
        } as UserDto

        // Mock error thrown by the repository insert method
        const error = new Error('Insertion failed')

        // Mock handleError.uniqueConstraint method
        handleError.uniqueConstraint = jest.fn()

        // Mock repository insert method to throw an error
        repository.userRepository.insert = jest.fn().mockRejectedValue(error)

        // Call the createUser method and expect it to throw a ServerError
        await expect(service.userService.createUser(payload)).rejects.toThrow(ServerError)

        // Verify that the handleError.uniqueConstraint method was called with the correct arguments
        expect(handleError.uniqueConstraint).toHaveBeenCalledWith(error, 'Failed to insert user data, please try again')
    })
})
