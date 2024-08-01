import XenquAPI from "..";
import { Policy } from "../Models/Policy";
import { UserInfo } from "../Models";

export default class AccountRoutes {

  /**
   * Gets the Current API User's Information
   * @see [API Docs]{@link https://apidocs.xenqu.com/#3e68223a-c6a6-4469-b2be-5a43315c7210}
   */
  public getUserInfo(): Promise<UserInfo> {
    return XenquAPI.Base.makeGet('/user/info');
  }

  /**
   * Get the device policy for the logged in user
   * @param fingerprint Device fingerprint
   * @returns The auth policy for the current user
   */
  public getPolicy(fingerprint?: string): Promise<Policy> {
    const urlExt = fingerprint ? `?mid=${fingerprint}` : '';
    return XenquAPI.Base.makeGet(`/user/policy${urlExt}`);
  }

}