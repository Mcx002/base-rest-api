import Provider from '../../provider';
import {Logger} from 'winston';

export default class BaseService {
    protected provider!: Provider
    protected logger!: Logger
    init(provider: Provider, logger: Logger) {
        this.provider = provider
        this.logger = logger
    }
}