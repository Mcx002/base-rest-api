import Provider from '../../provider'

export default abstract class BaseRepository {
    abstract init(provider: Provider): void
}
