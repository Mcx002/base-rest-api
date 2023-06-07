import Provider from '../../provider'

export default abstract class BaseService {
    abstract init(provider: Provider): void
}
