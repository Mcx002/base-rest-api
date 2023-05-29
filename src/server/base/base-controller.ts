import Provider from '../../provider';
import {Logger} from 'winston';

export default class BaseController {
    provider!: Provider
    logger!: Logger

    init(provider: Provider, logger: Logger) {
        this.provider = provider
        this.logger = logger
    }
}