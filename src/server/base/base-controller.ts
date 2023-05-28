import Provider from '../../provider';

export default abstract class BaseController {
    provider!: Provider
    init(provider: Provider) {
        this.provider = provider
    }
}