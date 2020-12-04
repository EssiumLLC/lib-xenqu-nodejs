import * as jwt from "jsonwebtoken"
import XenquBase from "./XenquBase";
import Oath2Token from "./Models/Oath2Token";
import Account from "./Routes/Account";
import Contact from "./Routes/Contact";
import Tracking from "./Routes/Tracking";
import Forms from "./Routes/Forms";
import Reports from "./Routes/Reports";
import Files from "./Routes/Files";
import Search from "./Routes/Search";

export default class XenquAPI {

  /* Global Variables */
  private clientId: string;
  private clientSecret: string;
  private privateKey: string;
  private subscriber: string;
  private url: string;
  private isInit: boolean = false;

  /* API Pieces */
  private base: XenquBase;
  private _account: Account = new Account();
  private _contact: Contact = new Contact();
  private _tracking: Tracking = new Tracking();
  private _forms: Forms = new Forms();
  private _reports: Reports = new Reports();
  private _files: Files = new Files();
  private _search: Search = new Search();

  /**
   * Constructor
   * @param clientId Client ID
   * @param clientSecret Client Secret
   * @param privateKey Private Key
   * @param subscriber User ID to use
   * @param url URL to Xenqy API (Default https://xenqu.com/api)
   */
  constructor(clientId: string, clientSecret: string, privateKey: string, subscriber: string, url: string = 'https://xenqu.com/api') {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.privateKey = privateKey;
    this.subscriber = subscriber;
    this.url = url;
    this.base = new XenquBase(url, clientId, clientSecret);
  }

  /**
   * Init Connection to API
   */
  public init(): Promise<any> {
    if (!this.isInit) {
      return this.reauthOath2().then((oath: Oath2Token) => {
        this.base.updateOath(oath)
        // Update all of our routes
        this.account.update(this.base);
        this.contact.update(this.base);
        this.tracking.update(this.base);
        this.forms.update(this.base);
        this.reports.update(this.base);
        this.files.update(this.base);
        this.search.update(this.base);
        this.isInit = true;
        return true;
      });
    } else {
      throw new Error("Already initiated!")
    }
  }

  /**
   * Authorize Connection and get Oath token
   * @private
   */
  private reauthOath2(): Promise<any> {
    // Base 64 encode  for auth header
    const authorization = 'Basic ' + Buffer.from(this.clientId + ':' + this.clientSecret).toString('base64');
    const payload = {
      exp: (new Date()).getTime() / 1000 + 300,
      iss: this.clientId,
      aud: "https://xenqu.com",
      sub: this.subscriber,
    }
    const token = jwt.sign(payload, this.privateKey, {algorithm: "RS256"})
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': authorization
    }
    const body = 'grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=' + token;
    return this.base.makeOathRequest('/oauth2/token', headers, body);
  }


  /**
   * Get Account Routes
   */
  get account() {
    return this._account;
  }
  /**
   * Get Contact Routes
   */
  get contact() {
    return this._contact;
  }
  /**
   * Get Tracking Routes
   */
  get tracking() {
    return this._tracking;
  }
  /**
   * Get Forms Routes
   */
  get forms() {
    return this._forms;
  }
  /**
   * Get Reports Routes
   */
  get reports() {
    return this._reports;
  }
  /**
   * Get Files Routes
   */
  get files() {
    return this._files;
  }
  /**
   * Get Search Routes
   */
  get search() {
    return this._search;
  }
}