import XenquBase from "../XenquBase";

export default class Search {

  /* Global Variables */
  private base: XenquBase;

  constructor() {
    this.base = new XenquBase('');
  }

  update(base: XenquBase) {
    this.base = base;
  }

}