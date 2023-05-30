import EnvConfiguration from './config';
import {Logger} from 'winston';
import ControllerProvider from './server/controllers';
import ServiceProvider from './server/services';
import RepositoryProvider from './server/repositories';

export default class Provider {
    public config: EnvConfiguration
    public logger: Logger
    public controller!: ControllerProvider
    public service!: ServiceProvider
    public repository!: RepositoryProvider

    constructor(config: EnvConfiguration, logger: Logger) {
        this.config = config
        this.logger = logger
    }
}