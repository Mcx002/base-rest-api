import Provider from '../../provider';
import BaseService from '../base/base-service';
import {HealthService} from './health.service';
import {Logger} from 'winston';

export default class Service {
    private readonly provider: Provider
    private readonly logger: Logger

    public healthService: HealthService = new HealthService()

    constructor(provider: Provider) {
        this.provider = provider
        this.logger = provider.logger.child({childLabel: 'Service'})

        for (const item in this) {
            if (!(this[item] instanceof BaseService)) {
                continue
            }
            (this[item] as BaseService).init(this.provider, this.logger)
            this.logger.info(`Initiate ${item}`)
        }
    }
}