export default class XenquApiError extends Error {
    public readonly status: number;
    public readonly statusText: string;
    public readonly response: Response;

    constructor(
        res: Response | (Error & { response?: Response }),
        ...params: string[]
    ) {
        const underlying = res instanceof Response ? null : res;
        const httpRes = (res instanceof Response ? res : res.response) as
            | Response
            | undefined;
        const detail =
            underlying?.message && underlying.message !== httpRes?.statusText
                ? underlying.message
                : "";

        super(detail || params[0] || "Xenqu API error");

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, XenquApiError);
        }
        this.name = "XenquAPIError";
        this.message =
            "\n Message: Received non-200 from API" +
            (detail ? "\n Detail: " + detail : "") +
            "\n URL: " +
            " " +
            (httpRes?.url ?? "") +
            "\n Response Code: [" +
            (httpRes?.status ?? "") +
            "] " +
            (httpRes?.statusText ?? "");
        if (httpRes) {
            switch (httpRes.status) {
                case 400:
                    this.name = "\n XenquBadRequest";
                    break;
                case 401:
                    this.name = "\n XenquUnauthorized";
                    break;
                case 403:
                    this.name = "\n XenquForbidden";
                    break;
                case 404:
                    this.name = "\n XenquNotFound";
                    break;
                case 500:
                    this.name = "\n XenquInternalServerError";
                    break;
            }
            this.status = httpRes.status;
            this.statusText = httpRes.statusText;
            this.response = httpRes;
        }
    }
}
