import Provider from '../../provider';
import BaseService from '../base/base-service';
import {HealthService} from './health.service';
import {Logger} from 'winston';
import {UserService} from './user.service';

export default class ServiceProvider {
    private readonly provider: Provider
    private readonly logger: Logger

    // Service Store
    public healthService: HealthService = new HealthService()
    public userService: UserService = new UserService()

    constructor(provider: Provider) {
        this.provider = provider
        this.logger = provider.logger.child({childLabel: 'Service'})

        // Initiate Service
        for (const item in this) {
            if (!(this[item] instanceof BaseService)) {
                continue
            }
            (this[item] as BaseService).init(this.provider, this.logger)
            this.logger.info(`Initiate ${item}`)
        }
    }
}