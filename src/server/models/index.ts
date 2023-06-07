import { User } from './user.model'
import Provider from '../../provider'
import DbContext from '../../db-context'

export default class ModelProvider {
    public dbContext: DbContext
    constructor(provider: Provider) {
        this.dbContext = new DbContext(provider)
        const sequelize = this.dbContext.sequelize

        // Initiate Model
        User.initModel(sequelize)
    }
}
