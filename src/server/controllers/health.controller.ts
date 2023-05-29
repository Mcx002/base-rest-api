import BaseController from '../base/base-controller';
import {Get, Module} from '../../decorators/controller.decorator';

@Module('/')
export class HealthController extends BaseController {

    @Get()
    getHealth () {
        return this.provider.service.healthService.getHealth()
    }
}