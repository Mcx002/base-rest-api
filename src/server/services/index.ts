import Provider from '../../provider'
import BaseService from '../base/base-service'
import { HealthService } from './health.service'
import { UserService } from './user.service'

export default class ServiceProvider {
    private readonly provider: Provider

    // Service Store
    public healthService: HealthService = new HealthService()
    public userService: UserService = new UserService()

    constructor(provider: Provider) {
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
