import request from 'supertest'
import {boot} from '../../src';
import EnvConfiguration from '../../src/config';

describe('Health Controller E2E Test', () => {
    test('[/] Should Get Health', async () => {
        const config = new EnvConfiguration()

        const server = await boot()
        const res = await request(server.app).get('/')
        expect(res.statusCode).toEqual(200)
        expect(res.body).toHaveProperty('data')
        expect(res.body.data.appName).toEqual(config.appName)
    })
})