import { ClientError, ServerError } from '../../../src/utils/errors'

describe('Errors Utility', () => {
    test('Ensure ClientError Class Working well', () => {
        const error = new ClientError('Error')
        expect(error.message).toBe('Error')
        expect(error.status).toBe(400)
        expect(error.code).toBe('N/A')

        error.setStatus(404)
        expect(error.status).toBe(404)

        error.setCode('E_COMM_1')
        expect(error.code).toBe('E_COMM_1')
    })
    test('Ensure ServerError Class Working well', () => {
        const error = new ServerError('Error')
        expect(error.message).toBe('Error')
        expect(error.status).toBe(500)

        error.setStatus(502)
        expect(error.status).toBe(502)
    })
})
