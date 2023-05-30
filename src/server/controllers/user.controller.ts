import BaseController from '../base/base-controller';
import {Get, Module} from '../../decorators/controller.decorator';
import {GetDetailPayload} from '../../dto/common.dto';
import {Request} from 'express';

@Module('/users')
export class UserController extends BaseController {

    @Get('/:xid')
    async getDetailUser(req: Request) {
        const payload: GetDetailPayload = {
            xid: req.params.xid
        }

        return this.provider.service.userService.getDetailUser(payload)
    }
}