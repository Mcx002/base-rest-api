import BaseService from '../base/base-service'
import { convertSecondsToUptime } from '../../utils/date-formatter'
import { HealthDto } from '../../dto/health.dto'
import EnvConfiguration from '../../config'
import Provider from '../../provider'

export class HealthService extends BaseService {
    config!: EnvConfiguration
    init(provider: Provider) {
        this.config = provider.config
    }

    getHealth = (): HealthDto => {
        // convert seconds to duration
        const uptime = convertSecondsToUptime(process.uptime())

        return {
            appName: this.config.appName,
            version: this.config.appVersion,
            uptime: uptime,
        }
    }
}
