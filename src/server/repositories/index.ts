import Provider from '../../provider';
import {Logger} from 'winston';
import {UserRepository} from './user.repository';
import BaseRepository from '../base/base-repository';

export default class RepositoryProvider {
    private readonly provider: Provider
    private readonly logger: Logger

    // Repository Store
    public userRepository: UserRepository = new UserRepository()

    constructor(provider: Provider) {
        this.provider = provider
        this.logger = provider.logger.child({childLabel: 'Repository'})

        // Initiate Repository
        for (const item in this) {
            if (!(this[item] instanceof BaseRepository)) {
                continue
            }
            (this[item] as BaseRepository).init(this.provider, this.logger)
            this.logger.info(`Initiate ${item}`)
        }
    }
}