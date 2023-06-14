import Provider from '../../provider'
import BaseController from '../base/base-controller'
import { ModuleController, PathController } from '../../decorators/metadata-keys'
import { Router } from 'express'
import { PathMetadata } from '../../decorators/controller.decorator'

// Controller Imports
import { HealthController } from './health.controller'
import { UserController } from './user.controller'
import { ClientError, MError } from '../../utils/errors'
import { ErrorResponse } from '../../dto/common.dto'
// -- Controller Import Port -- //

export default class ControllerProvider {
    provider!: Provider

    // Controller Store
    healthController = new HealthController()
    userController = new UserController()
    // -- Controller Initiation Port -- //

    init(provider: Provider): void {
        this.provider = { ...provider }
        this.provider.logger = provider.logger.child({ childLabel: 'Controller' })

        // Initiate Controller
        Object.entries(this).forEach(([k, r]) => {
            if (r instanceof BaseController) {
                r.init(this.provider)
                this.provider.logger.debug(`${k} initiated`)
            }
        })
    }
    getRouters = async (): Promise<Router> => {
        // Prepare route modules
        const moduleRoutes = Router()
        for (const item in this) {
            // skip if properties is not BaseController abstraction
            if (!(this[item] instanceof BaseController)) {
                continue
            }

            // Get target property
            const target = this[item] as BaseController

            // Get module metadata
            const module = Reflect.getMetadata(ModuleController, target)

            // Get path metadata
            const paths: PathMetadata[] = Reflect.getMetadata(PathController, target)

            // Create path routes
            const pathRoutes = Router()

            for (const path of paths) {
                this.provider.logger.info(`Prepare ${module}${path.path} Endpoint`)
                pathRoutes[path.method](path.path, async (req, res, next) => {
                    try {
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore
                        const data = await this[item][path.propertyKey](req, res, next)
                        res.json({
                            message: 'OK',
                            data,
                        })
                    } catch (e) {
                        // Set Error
                        const error = e as MError
                        const errorMessage: ErrorResponse = {
                            message: error.message,
                            data: error.data,
                        }

                        if (error instanceof ClientError) {
                            errorMessage.code = error.code
                        }

                        res.status(error.status)
                        res.json(errorMessage)
                    }
                })
            }
            moduleRoutes.use(module, pathRoutes)
        }
        return moduleRoutes
    }
}
