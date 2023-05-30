import Provider from '../../provider';
import BaseController from '../base/base-controller';
import {ModuleController, PathController} from '../../decorators/metadata-keys';
import {HealthController} from './health.controller';
import {Router} from 'express';
import {PathMetadata} from '../../decorators/controller.decorator';
import {Logger} from 'winston';
import {UserController} from './user.controller';

export default class ControllerProvider {
    private readonly provider: Provider
    private readonly logger: Logger

    // Controller Store
    public healthController = new HealthController()
    public userController = new UserController()

    constructor(provider: Provider) {
        this.provider = provider
        this.logger = provider.logger.child({childLabel: 'Controller'})

        // Initiate Controller
        for (const item in this) {
            if (!(this[item] instanceof BaseController)) {
                continue
            }
            (this[item] as BaseController).init(this.provider, this.logger)
        }
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
            const target = (this[item] as BaseController)

            // Get module metadata
            const module = Reflect.getMetadata(ModuleController, target)

            // Get path metadata
            const paths: PathMetadata[] = Reflect.getMetadata(PathController, target)

            // Create path routes
            const pathRoutes = Router()

            for (const path of paths) {
                this.logger.info(`Prepare ${module}${path.path} Endpoint`)
                pathRoutes[path.method](path.path, async (req, res, next) => {
                    try {
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore
                        const data = await this[item][path.propertyKey](req, res, next)
                        res.json({
                            message: 'ok',
                            data,
                        })
                    } catch (e) {
                        console.log(e)
                    }
                })
            }
            moduleRoutes.use(module, pathRoutes)
        }
        return moduleRoutes
    }
}