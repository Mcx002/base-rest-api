import Provider from '../../provider'
import { UserRepository } from './user.repository'
import BaseRepository from '../base/base-repository'

export default class RepositoryProvider {
    private readonly provider: Provider

    // Repository Store
    public userRepository: UserRepository = new UserRepository()

    constructor(provider: Provider) {
        this.provider = { ...provider }
        this.provider.logger = provider.logger.child({ childLabel: 'Repository' })

        // Initiate Repository
        Object.entries(this).forEach(([k, r]) => {
            if (r instanceof BaseRepository) {
                r.init(this.provider)
                this.provider.logger.debug(`${k} initiated`)
            }
        })
    }
}
