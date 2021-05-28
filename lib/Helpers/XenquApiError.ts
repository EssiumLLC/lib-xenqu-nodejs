export default class XenquApiError extends Error {
    public readonly status: number;
    public readonly statusText: string;
    public readonly response: Response;

    constructor(res: Response, ...params) {
        super(...params)

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, XenquApiError)
        }
        this.name = "XenquAPIError"
        this.message =
            '\n Message: Received non-200 from API' +
            '\n URL: ' + ' ' + res.url +
            '\n Response Code: [' + res.status + '] ' + res.statusText;
        switch(res.status) {
            case 400: this.name = '\n XenquBadRequest'; break;
            case 401: this.name = '\n XenquUnauthorized'; break;
            case 403: this.name = '\n XenquForbidden'; break;
            case 404: this.name = '\n XenquNotFound'; break;
            case 500: this.name = '\n XenquInternalServerError'; break;
        }
        this.response = res;
    }
}
