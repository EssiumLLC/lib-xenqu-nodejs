import XenquBase from "../XenquBase";

export default class SearchRoutes {

  /* Global Variables */
  private base: XenquBase;

  constructor() {
    this.base = new XenquBase('');
  }

  update(base: XenquBase) {
    this.base = base;
  }

  // TODO: Not in API Docs Yet

}