import Provider from '../../provider'
import BaseService from '../base/base-service'
import { HealthService } from './health.service'
import { UserService } from './user.service'

export default class ServiceProvider {
    provider!: Provider

    // Service Store
    healthService: HealthService = new HealthService()
    userService: UserService = new UserService()

    init(provider: Provider): void {
        this.provider = { ...provider }
        this.provider.logger = provider.logger.child({ childLabel: 'Service' })

        // Initiate Service
        Object.entries(this).forEach(([k, r]) => {
            if (r instanceof BaseService) {
                r.init(this.provider)
                this.provider.logger.info(`${k} initiated`)
            }
        })
    }
}
