import BaseService from '../base/base-service'
import { GetDetailPayload } from '../../dto/common.dto'
import { UserDto } from '../../dto/user.dto'
import { UserAttributes } from '../models/user.model'
import { Logger } from 'winston'
import Provider from '../../provider'
import { UserRepository } from '../repositories/user.repository'

export class UserService extends BaseService {
    log!: Logger
    userRepository!: UserRepository

    init(provider: Provider) {
        const { logger, repository } = provider

        this.log = logger
        this.userRepository = repository.userRepository
    }

    getDetailUser = async (payload: GetDetailPayload): Promise<UserDto> => {
        // Find User by xid
        const row = await this.userRepository.findByXid(payload.xid)
        if (!row) {
            throw new Error('Resource not found')
        }

        return this.composeUser(row)
    }

    composeUser = (row: UserAttributes): UserDto => {
        return {
            xid: row.xid,
            name: row.name,
            email: row.email,
        }
    }
}
