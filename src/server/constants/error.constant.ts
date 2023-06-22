import { ClientError, ServerError } from '../../utils/errors'

export const errors = {
    // Common
    resourceNotFound: new ClientError('Resource Not Found').setCode('E_COMM_1'),
}

export const handleError = {
    uniqueConstraint: (e: unknown, message = 'Error Unique Constraint') => {
        const error = e as Error
        if (error.name === 'SequelizeUniqueConstraintError') {
            throw new ServerError(message)
        }
    },
}
