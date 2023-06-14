export abstract class MError extends Error {
    status: number
    message: string
    data: unknown
    protected constructor(status: number, message: string, data: unknown) {
        super(message)

        this.status = status
        this.message = message
        this.data = data
    }
}

export class ClientError extends MError {
    code: string
    constructor(message: string, data?: unknown) {
        super(400, message, data)

        this.code = 'N/A'
    }

    setStatus(status: number): ClientError {
        this.status = status

        return this
    }

    setCode(code: string): ClientError {
        if (code !== '') {
            this.code = code
        }

        return this
    }
}

export class ServerError extends MError {
    constructor(message: string, data?: unknown) {
        super(500, message, data)
    }

    setStatus(status: number): ServerError {
        this.status = status

        return this
    }
}
