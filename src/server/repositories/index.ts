import Provider from '../../provider'
import BaseRepository from '../base/base-repository'

// Repository Imports
import { UserRepository } from './user.repository'
// -- Repository Import Port -- //

export default class RepositoryProvider {
    provider!: Provider

    // Repository Store
    userRepository = new UserRepository()
    // -- Repository Initiation Port -- //

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
