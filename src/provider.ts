import EnvConfiguration from './config';
import {Logger} from 'winston';
import Controller from "./server/controllers";

interface ProviderConstructor {
    config: EnvConfiguration
    logger: Logger
}

export default class Provider {
    public config: EnvConfiguration
    public logger: Logger
    public controller?: Controller
    constructor({ config, logger }: ProviderConstructor) {
        this.config = config
        this.logger = logger
    }
}