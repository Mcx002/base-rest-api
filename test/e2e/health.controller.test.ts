import request from 'supertest'
import {boot} from '../../src';
import packageJson from '../../package.json'

describe('Health Controller E2E Test', () => {
    test('Should Get Health', async () => {
        const server = boot()
        const res = await request(server.app).get('/')
        expect(res.statusCode).toEqual(200)
        expect(res.body).toHaveProperty('data')
        expect(res.body.data.appName).toEqual(packageJson.name)
    })
})