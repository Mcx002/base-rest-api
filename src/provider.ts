import EnvConfiguration from './config';
import {Logger} from 'winston';
import Controller from './server/controllers';
import Service from './server/services';
import Repository from './server/repositories';

export default class Provider {
    public config: EnvConfiguration
    public logger: Logger
    public controller!: Controller
    public service!: Service
    public repository!: Repository

    constructor(config: EnvConfiguration, logger: Logger) {
        this.config = config
        this.logger = logger
    }
}