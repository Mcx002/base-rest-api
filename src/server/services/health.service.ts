import BaseService from '../base/base-service'
import { convertSecondsToDuration } from '../../utils/date-formatter'
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
        const { years, months, days, hours, minutes, seconds } = convertSecondsToDuration(process.uptime())

        let uptime = `${seconds} Seconds`

        if (minutes > 0) {
            uptime = `${minutes} Minutes`
        }

        if (hours > 0) {
            uptime = `${hours} Hours`
        }

        if (days > 0) {
            uptime = `${days} Days`
        }

        if (months > 0) {
            uptime = `${months} Months`
        }

        if (years > 0) {
            uptime = `${years} Years`
        }

        return {
            appName: this.config.appName,
            version: this.config.appVersion,
            uptime: uptime,
        }
    }
}
