import XenquAPI from "..";
import Contact from "../Models/Contact";

export default class ContactRoutes {

  /**
   * SearchRoutes Contacts
   * The preferred end point for accessing contacts is tracking/contacts.
   * This end point only returns contacts created by the current user.
   * Refer to that documentation for options.
   * @see [API Docs]{@link https://apidocs.xenqu.com/#e0fbbe9f-1ae3-4523-adff-ea8506ce7e0a}
   * @param term Search Term
   */
  public searchContacts(term: string): Promise<any> {
    return XenquAPI.Base.makeGet('/contact', {term: term});
  }

  /**
   * Contact Detail
   * Get full details on a contact
   * @see [API Docs]{@link https://apidocs.xenqu.com/#24bb22da-7e96-4c16-8c32-c4bca1aeed86}
   * @param contactId: Contact ID to get
   */
  public getContactDetail(contactId: string): Promise<any> {
    return XenquAPI.Base.makeGet('/contact/' + contactId);
  }

  /**
   * Add Contact
   * Add a new contact. Returns created contact.
   * @see [API Docs]{@link https://apidocs.xenqu.com/#7969a360-ee09-41a8-9299-05a5f0ffb7fb}
   * @param contact Contact data to add
   */
  public addContact(contact: Contact): Promise<any> {
    return XenquAPI.Base.makePost('/contact', JSON.stringify(contact.toJson()));
  }

  /**
   * Edit Contact
   * Edit a contact. Returns edited contact.
   * @see [API Docs]{@link https://apidocs.xenqu.com/#7ef9b643-8086-4ca0-ad5c-05895dc3eb52}
   * @param contactId Contact ID to edit
   * @param contact Contact data to edit
   */
  public editContact(contactId: string, contact: Contact): Promise<any> {
    return XenquAPI.Base.makePut('/contact/' + contactId, JSON.stringify(contact.toJson()));
  }

  /**
   * Delete Contact
   * Delete a contact. Returns deleted contact id.
   * @see [API Docs]{@link https://apidocs.xenqu.com/#027b6abb-2ac1-40dc-a82c-afe4a631aae3}
   * @param contactId Contact ID to delete
   */
  public deleteContact(contactId: string): Promise<any> {
    return XenquAPI.Base.makeDelete('/contact/' + contactId);
  }

}
