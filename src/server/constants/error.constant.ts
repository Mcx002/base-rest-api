import { ClientError } from '../../utils/errors'

export const errors = {
    // Common
    resourceNotFound: new ClientError('Resource Not Found').setCode('E_COMM_1'),
}
