import XenquBase from "../../XenquBase";

export default class TabsRoutes {

  /* Global Variables */
  private base: XenquBase;

  constructor() {
    this.base = new XenquBase('');
  }

  update(base: XenquBase) {
    this.base = base;
  }

  /**
   * Retrieve all contacts the current user can access within the scope of their tab membership, contact ownership, and task assignments
   * @see [API Docs]{@link https://apidocs.xenqu.com/#7dab4692-f5f6-420d-9f46-dfc10c55e7d0}
   * @param term Search term
   * @param scope Scope of search. Can be any of the required strings, or any combination of them (separated by commas)
   * @param count Number of items to return. Defaults to 10.
   * @param offset Offset to access by. Results are always pagenated. Defaults to 0
   */
  getContacts(term: string, scope: "display_name" | "primary_email" | "primary_phone" | "org_name" | "title" | "tags" | string, count: number = 10, offset: number = 0) {
    return this.base.makeGet(`/tracking/contacts?term=${term}&scope=${scope}&count=${count}&offset=${offset}`)
  }

  /**
   * Get a list of tabs the current user is a member of
   * @see [API Docs]{@link https://apidocs.xenqu.com/#764d0965-219e-41a0-b0cc-5896c39012c8}
   */
  getTabs() {
    return this.base.makeGet(`/tracking/groups`)
  }

  /**
   * Get a list of all available items for a given tab that can be added to a record
   * @see [API Docs]{@link https://apidocs.xenqu.com/#f89c6d8b-b7f6-48a2-9ab7-5ffc0029b326}
   * @param groupId Tab ID to get items from
   */
  getItems(groupId: string) {
    return this.base.makeGet(`/tracking/groups/${groupId}/list/items`)
  }

  /**
   * Get a list of predefined templates that can used to add content to a record
   * @see [API Docs]{@link https://apidocs.xenqu.com/#c1386fb4-46fb-4934-91c4-e811f0fb56de}
   * @param groupId Tab ID to get templates from
   */
  getTemplates(groupId: string) {
    return this.base.makeGet(`/tracking/groups/${groupId}/queue_templates`)
  }

  /**
   * Load the predefined queues and items based on the template id
   * @see [API Docs]{@link https://apidocs.xenqu.com/#76dd3859-1f6f-479d-bd58-64b742cf8bdf}
   * @param groupId Tab ID to get get template from
   * @param templateId Template ID to get
   */
  getTemplate(groupId: string, templateId: string) {
    return this.base.makeGet(`/tracking/groups/${groupId}/queue_templates/${templateId}`)
  }

  /**
   * Get a list of all content libraries available on a tab
   * @see [API Docs]{@link https://apidocs.xenqu.com/#2d7ae85c-9ea3-4832-83f5-14f982756c20}
   * @param groupId Tab ID to get libraries from
   */
  getLibraries(groupId: string) {
    return this.base.makeGet(`/tracking/groups/${groupId}/libraries`)
  }

  /**
   * Search for items and/or libraries by title
   * @see [API Docs]{@link https://apidocs.xenqu.com/#ee9ddc77-a8a6-49b7-a7d7-f9a72c44d00c}
   * @param groupId Tab ID to search
   * @param query Search Query
   */
  searchLibraries(groupId: string, query: string) {
    return this.base.makePost(`/tracking/groups/${groupId}/libraries`, JSON.stringify({title: query}))
  }

}