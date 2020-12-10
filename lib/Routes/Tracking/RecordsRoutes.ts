import XenquBase from "../../XenquBase";

export default class RecordsRoutes {

  /* Global Variables */
  private base: XenquBase;

  constructor() {
    this.base = new XenquBase('');
  }

  update(base: XenquBase) {
    this.base = base;
  }

  /**
   * Get a record and its content on a specific tab
   * @see [API Docs]{@link https://apidocs.xenqu.com/#3bd6f73c-b25e-4d3f-8695-5e58d35df88d}
   * @param groupId Tab ID to get record from
   * @param contactId Contact ID to get
   */
  getQueue(groupId: string, contactId: string) {
    return this.base.makeGet(`/tracking/groups/${groupId}/actors/${contactId}`)
  }

  /**
   * Initiates running automation rules on the record. This should be called after saving all queues or
   * editing any data that does not result in an item action (changing status, actors,etc)
   * @see [API Docs]{@link https://apidocs.xenqu.com/#f7b392bb-169b-4aca-b8d9-9cbafc471f9a}
   * @param groupId Tab ID to get record from
   * @param contactId Contact ID to run rules on
   */
  applyRules(groupId: string, contactId: string) {
    return this.base.makeGet(`/tracking/groups/${groupId}/actors/${contactId}/apply_rules`)
  }

}