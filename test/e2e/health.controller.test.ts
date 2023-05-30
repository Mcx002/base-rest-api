import request from 'supertest'
import EnvConfiguration from '../../src/config';
import {afterAll, beforeAll} from '@jest/globals';
import http from 'http';
import {boot} from '../../src/boot';

describe('Health Controller E2E Test', () => {
    let server: http.Server
    beforeAll(async () => {
        const settings = await boot()
        server = settings.app.listen(settings.config.port)

    })
    afterAll(() => {
        server.close()
    })
    test('[/] Should Get Health', async () => {
        const config = new EnvConfiguration()

        const res = await request(server).get('/')
        expect(res.statusCode).toEqual(200)
        expect(res.body).toHaveProperty('data')
        expect(res.body.data.appName).toEqual(config.appName)
    })
})