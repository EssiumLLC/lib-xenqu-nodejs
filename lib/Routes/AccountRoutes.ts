import XenquAPI from "..";
import { Policy } from "../Models/Policy";
import { UserInfo } from "../Models";

export default class AccountRoutes {
    /**
     * Gets the Current API User's Information
     * @see [API Docs]{@link https://apidocs.xenqu.com/#3e68223a-c6a6-4469-b2be-5a43315c7210}
     */
    public getUserInfo(userId?: string): Promise<UserInfo> {
        const path = userId ? `/user/info/${userId}` : "/user/info";
        return XenquAPI.Base.makeGet(path);
    }

    /**
     * List accounts resolved for the current user.
     */
    public getAccounts(): Promise<any> {
        return XenquAPI.Base.makeGet("/accounts");
    }

    /**
     * Resolve login User._id from a contact the caller can access (discovery / triage).
     */
    public lookupUser(params: {
        contact_id?: string | number;
        email?: string;
    }): Promise<any> {
        const query: Record<string, string> = {};
        if (params.contact_id != null)
            query.contact_id = String(params.contact_id);
        if (params.email) query.email = params.email;
        return XenquAPI.Base.makeGet("/user/lookup", query);
    }

    /**
     * List users on a licensed account.
     */
    public listAccountUsers(
        accountId: string,
        params?: {
            term?: string;
            scope?: string;
            count?: number;
            offset?: number;
        }
    ): Promise<any> {
        const query: Record<string, string> = {};
        if (params?.term) query.term = params.term;
        if (params?.scope) query.scope = params.scope;
        if (params?.count != null) query.count = String(params.count);
        if (params?.offset != null) query.offset = String(params.offset);
        return XenquAPI.Base.makeGet(`/accounts/${accountId}/users`, query);
    }

    /**
     * Get the device policy for the logged in user
     * @param fingerprint Device fingerprint
     * @returns The auth policy for the current user
     */
    public getPolicy(fingerprint?: string): Promise<Policy> {
        const urlExt = fingerprint ? `?mid=${fingerprint}` : "";
        return XenquAPI.Base.makeGet(`/user/policy${urlExt}`);
    }
}
