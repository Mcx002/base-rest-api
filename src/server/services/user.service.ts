import BaseService from '../base/base-service'
import { GetDetailPayload } from '../../dto/common.dto'
import { UserDto } from '../../dto/user.dto'
import { UserAttributes, UserCreationAttributes } from '../models/user.model'
import { Logger } from 'winston'
import Provider from '../../provider'
import { UserRepository } from '../repositories/user.repository'
import { errors, handleError } from '../constants/error.constant'
import * as randomstring from 'randomstring'
import { ServerError } from '../../utils/errors'

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
            throw errors.resourceNotFound
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

    createUser = async (payload: UserDto): Promise<UserDto> => {
        // Prepare insert value
        const userForm: UserCreationAttributes = {
            xid: randomstring.generate(6),
            name: payload.name,
            email: payload.email,
        }

        // Persist insert data
        let data: UserAttributes
        try {
            data = await this.userRepository.insert(userForm)
        } catch (e) {
            // error handlers
            handleError.uniqueConstraint(e, 'Failed to insert user data, please try again')

            // default error
            throw new ServerError('Failed to insert user data')
        }

        // compose and return
        return this.composeUser(data)
    }
}
