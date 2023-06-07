import { boot } from './boot'

async function main() {
    const { app, config, logger } = await boot()

    app.listen(config.port, () => logger.info(`Running on Port: ${config.port}`))
}

main().catch((e) => console.error(e))
