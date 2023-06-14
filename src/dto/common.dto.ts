export interface GetDetailPayload {
    xid: string
}

export interface ErrorResponse {
    code?: string
    message: string
    data: unknown
}
