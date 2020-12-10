import XenquBase from "../XenquBase";

export default class AccountRoutes {

  /* Global Variables */
  private base: XenquBase;

  constructor() {
    this.base = new XenquBase('');
  }

  update(base: XenquBase) {
    this.base = base;
  }

  /**
   * Gets the Current API User's Information
   * @see [API Docs]{@link https://apidocs.xenqu.com/#3e68223a-c6a6-4469-b2be-5a43315c7210}
   */
  public getUserInfo(): Promise<any> {
    return this.base.makeGet('/user/info');
  }

}