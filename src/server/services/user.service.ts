import BaseService from '../base/base-service';
import {GetDetailPayload} from '../../dto/common.dto';
import {UserDto} from '../../dto/user.dto';
import {UserAttributes} from '../models/user.model';

export class UserService extends BaseService {
    getDetailUser = async (payload: GetDetailPayload): Promise<UserDto> => {
        // Find User by xid
        const row = await this.provider.repository.userRepository.findByXid(payload.xid)
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