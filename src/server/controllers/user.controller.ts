import BaseController from '../base/base-controller'
import { Get, Module, Post } from '../../decorators/controller.decorator'
import { GetDetailPayload } from '../../dto/common.dto'
import { Request } from 'express'
import Provider from '../../provider'
import { UserService } from '../services/user.service'
import { UserDto } from '../../dto/user.dto'
import { MValidator } from '../../utils/validator'
import { createUserValidator } from '../validators/user.validator'

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

    @Post()
    async postCreateUser(req: Request) {
        const payload = req.body as UserDto

        MValidator.validate(createUserValidator, payload)

        return this.userService.createUser(payload)
    }
}
