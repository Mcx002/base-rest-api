import BaseController from '../base/base-controller'
import { Get, Module } from '../../decorators/controller.decorator'
import { GetDetailPayload } from '../../dto/common.dto'
import { Request } from 'express'
import Provider from '../../provider'
import { UserService } from '../services/user.service'

@Module('/users')
export class UserController extends BaseController {
    userService!: UserService

    init(provider: Provider) {
        const { service } = provider

        this.userService = service.userService
    }

    @Get('/:xid')
    async getDetailUser(req: Request) {
        const payload: GetDetailPayload = {
            xid: req.params.xid,
        }

        return this.userService.getDetailUser(payload)
    }
}
