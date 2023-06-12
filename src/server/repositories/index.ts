import Provider from '../../provider'
import { UserRepository } from './user.repository'
import BaseRepository from '../base/base-repository'

export default class RepositoryProvider {
    provider!: Provider

    // Repository Store
    userRepository: UserRepository = new UserRepository()

    init(provider: Provider): void {
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
