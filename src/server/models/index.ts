import { User } from './user.model'
import Provider from '../../provider'
import DbAdapter from '../adapters/db.adapter'

export default class ModelProvider {
    public dbContext: DbAdapter
    constructor(provider: Provider) {
        this.dbContext = new DbAdapter(provider)
        const sequelize = this.dbContext.sequelize

        // Initiate Model
        User.initModel(sequelize)
    }
}
