import Provider from '../../provider';
import BaseController from '../base/base-controller';
import {ModuleController, PathController} from '../../decorators/metadata-keys';
import {HealthController} from './health.controller';
import {Router} from 'express';
import {PathMetadata} from '../../decorators/controller.decorator';

export default class Controller {
    private readonly provider: Provider
    public healthController

    constructor(provider: Provider) {
        this.provider = provider
        this.provider.logger = provider.logger.child({level: 'controller'})
        this.healthController =  new HealthController()

        for (const item in this) {
            if (!(this[item] instanceof BaseController)) {
                continue
            }
            (this[item] as BaseController).init(this.provider)
        }
    }

    getRouters = (): Router => {
        // Prepare route modules
        const moduleRoutes = Router()
        for (const item in this) {
            // skip if properties is not BaseController abstraction
            if (!(this[item] instanceof BaseController)) {
                continue
            }

            // Get target property
            const target = (this[item] as BaseController)

            // Get module metadata
            const module = Reflect.getMetadata(ModuleController, target)

            // Get path metadata
            const paths: PathMetadata[] = Reflect.getMetadata(PathController, target)

            // Create path routes
            const pathRoutes = Router()

            for (const path of paths) {
                this.provider.logger.info(`Prepare ${module}${path.path} Endpoint`)
                pathRoutes[path.method](path.path, (req, res, next) => {
                    const data = path.handler(req, res, next)
                    res.json({
                        message: 'ok',
                        data,
                    })
                })
            }
            moduleRoutes.use(module, pathRoutes)
            return moduleRoutes
        }
        return moduleRoutes
    }
}