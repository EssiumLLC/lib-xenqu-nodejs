import XenquBase from "../XenquBase";

export default class FormsRoutes {

  /* Global Variables */
  private base: XenquBase;

  constructor() {
    this.base = new XenquBase('');
  }

  update(base: XenquBase) {
    this.base = base;
  }

  /**
   * Get form instance data tied to an item on a record
   * @see [API Docs]{@link https://apidocs.xenqu.com/#140f933a-dc6d-404a-b072-9af30cb8cf57}
   * @param instanceId Form Instance ID to get
   */
  public getInstance(instanceId: string): Promise<any> {
    return this.base.makeGet('/jform/instance/' + instanceId);
  }

  /**
   * Lock/Unlock Form
   * @see [API Docs]{@link https://apidocs.xenqu.com/#7b50fc25-0966-41cd-ad28-47b6b803dec5}
   * @param instanceId Form Instance ID to lock/unlock
   * @param lock Whether to lock the form. If false, will be unlocked.
   * @param override It's in the API Docs. Not really explained. Defaults to true
   */
  public lockForm(instanceId: string, lock: boolean, override: boolean = true): Promise<any> {
    let payload = { };
    if(lock) payload = { lock: lock, override: override };
    if(!lock) payload = { unlock: !lock, override: override };
    return this.base.makePut('/jform/instance/' + instanceId, JSON.stringify(payload));
  }

  /**
   * Update Field
   * @see [API Docs]{@link https://apidocs.xenqu.com/#fd4f6a78-4cc3-4c34-bc2b-a072b0c4f937}
   * @param instanceId Form Instance ID to get page from
   * @param pageId Page ID to get field from
   * @param stateId Field ID to get field from
   * @param field Field data to update
   */
  public updateField(instanceId: string, pageId: string, stateId: string, field: {raw_value: string, fid: string}): Promise<any> {
    return this.base.makePut(`/jform/instance/${instanceId}/page/${pageId}/field/${stateId}`, JSON.stringify(field));
  }

  /**
   * Request a form to be converted to PDF.
   * This is an asynchronous process and require polling the instance for the definition.pdf_id
   * to change values from before the call to this end point to after the call.
   * A 5 second polling interval is recommended.
   * @see [API Docs]{@link https://apidocs.xenqu.com/#267bf445-2cd4-4a9c-bbf5-d84252193c8e}
   * @param instanceId Form Instance ID to get
   * @param pdfProperties Optional properties when generating a PDF Defaults to Signed PDF with info footer.
   */
  public generatePDF(instanceId: string, pdfProperties: {signed_pdf: true, info_footer: true}): Promise<any> {
    return this.base.makePost(`/jform/instance/${instanceId}/pdf`, JSON.stringify(pdfProperties));
  }

  /**
   * Files associated with a form can be downloaded by first requesting the file by its file id
   * which will return a temp id to use with the {@link FilesRoutes} 'downloadFile' to download the actual file.
   * @see [API Docs]{@link https://apidocs.xenqu.com/#6dd93321-6b80-4b74-af81-b2ccd0328478}
   * @param instanceId Form Instance ID to get
   * @param fileId File ID to get
   */
  public getFile(instanceId: string, fileId: string): Promise<any> {
    return this.base.makeGet(`/jform/instance/${instanceId}/file/${fileId}`);
  }

}