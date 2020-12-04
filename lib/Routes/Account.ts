import XenquBase from "../XenquBase";

export default class Account {

  /* Global Variables */
  private base: XenquBase;

  constructor() {
    this.base = new XenquBase('');
  }

  update(base: XenquBase) {
    this.base = base;
  }

  public getUserInfo(): Promise<any> {
    return this.base.makeGet('/user/info');
  }

}