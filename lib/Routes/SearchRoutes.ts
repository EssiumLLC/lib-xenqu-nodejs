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

  /**
   * Perform a quick search
   * @param query Array of query parameters
   * @param type Quick search type
   * @param accountId Unknown
   * @param inherited Unknown
   * @param limit Objects to return
   * @param offset Search object to start at
   * @param tabId Current Tab ID
   * @param total Unknown
   */
  quickSearch(query: {}[], type: "records" | "groups" | string, accountId: null | string = null, inherited: boolean = false, limit: number = 20, offset: number = 0, tabId?: string, total?: number) {
    const payload = {
      account_id: accountId,
      inherited: inherited,
      limit: limit,
      offset: offset,
      query: query,
      tab_id: tabId,
      type: type
    }
    return this.base.makePost(`/tracking/quick_search/${type}`, JSON.stringify(payload))
  }

}
