import Provider from '../../provider'

export default abstract class BaseController {
    abstract init(provider: Provider): void
}
