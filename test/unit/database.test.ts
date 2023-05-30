import EnvConfiguration from '../../src/config';
import Model from '../../src/server/models';
import {createLoggerTest} from '../logger';
import {beforeEach} from '@jest/globals';
import Repository from '../../src/server/repositories';
import Provider from '../../src/provider';
import {UserAttributes, UserCreationAttributes} from '../../src/server/models/user.model';

describe('Database test', () => {
    let repository: Repository

    beforeEach(async () => {
        const config = new EnvConfiguration()

        const logger = createLoggerTest()

        // Prepare Dependencies Injection
        const provider = new Provider(config, logger)

        const db = new Model(provider)
        const connected = await db.dbContext.checkConnection()

        expect(connected).toBe(true)

        repository = new Repository(provider)
    })

    test('Create Data', async () => {
        const row: UserCreationAttributes = {
            xid: 'F89JDO',
            name: 'Agung',
            email: 'agung@gmail.com',
        }

        const data = await repository.userRepository.insert(row)

        expect(data).toMatchObject(row)

        await repository.userRepository.deleteById(data.id)
    })

    test('Get Data', async () => {
        const row: UserCreationAttributes = {
            xid: 'F89JDO',
            name: 'Agung',
            email: 'agung@gmail.com',
        }

        const user = await repository.userRepository.insert(row)

        const data = await repository.userRepository.findByXid(row.xid)

        expect(data?.name).toEqual(row.name)

        await repository.userRepository.deleteById(user.id)

    })
    test('Update Data', async () => {
        const row: UserCreationAttributes = {
            xid: 'F89JDO',
            name: 'Agung',
            email: 'agung@gmail.com',
        }

        const user = await repository.userRepository.insert(row)

        const updatedUser: UserAttributes = {
            id: user.id,
            email: user.email,
            xid: user.xid,
            name: 'Agung nurjamal',
        }

        const data = await repository.userRepository.update(updatedUser)

        expect(data).toBe(1)

        await repository.userRepository.deleteById(user.id)
    })
})