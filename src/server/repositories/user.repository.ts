import BaseRepository from '../base/base-repository';
import {User, UserAttributes, UserCreationAttributes} from '../models/user.model';

export class UserRepository extends BaseRepository {
    findByXid = (xid: string): Promise<UserAttributes | null> => {
        return User.findOne({ where: { xid }})
    }

    insert = (row: UserCreationAttributes): Promise<UserAttributes> => {
        return User.create(row)
    }

    update = async (row: UserAttributes): Promise<number> => {
        const [count] = await User.update(row, { where: {id: row.id}})

        return count
    }

    deleteById = (id: number): Promise<number> => {
        return User.destroy({where: { id }})
    }
}