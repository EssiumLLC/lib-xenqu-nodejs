import XenquBase from "./XenquBase";
import OAuth2Token from "./Models/OAuth2Token";
import AccountRoutes from "./Routes/AccountRoutes";
import TrackingRoutes from "./Routes/TrackingRoutes";
import ReportsRoutes from "./Routes/ReportsRoutes";
import SearchRoutes from "./Routes/SearchRoutes";
import ContactRoutes from "./Routes/ContactRoutes";
import FormsRoutes from "./Routes/FormsRoutes";
import FilesRoutes from "./Routes/FilesRoutes";

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
  private _account: AccountRoutes = new AccountRoutes();
  private _contact: ContactRoutes = new ContactRoutes();
  private _tracking: TrackingRoutes = new TrackingRoutes();
  private _forms: FormsRoutes = new FormsRoutes();
  private _reports: ReportsRoutes = new ReportsRoutes();
  private _files: FilesRoutes = new FilesRoutes();
  private _search: SearchRoutes = new SearchRoutes();

  /**
   * Constructor
   * @param clientId Client ID received from Xenqu Admin
   * @param clientSecret Client Secret received from Xenqu Admin
   * @param privateKey Private Key that you generated, and shared the public counterpart with Xenqu Admin
   * @param subscriber User ID received from Xenqu Admin
   * @param url URL to Xenqu API. Defaults to https://xenqu.com/api
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
   * Initialize Connection to API
   */
  public init(): Promise<boolean> {
    if (!this.isInit) {
      return this.reauth();
    } else {
      throw new Error("Already initiated!")
    }
  }

  /**
   * Reauth Connection to API
   */
  public reauth(): Promise<boolean> {
    this.isInit = false;
    return this.base.makeOath2Request(this.clientId, this.clientSecret, this.subscriber, this.privateKey).then((data: OAuth2Token) => {
      this.base.updateOath(data)
      this.updateRoutes();
      this.isInit = true;
      return true;
    });
  }

  /**
   * Update all Routes
   * @private
   */
  private updateRoutes() {
    this.account.update(this.base);
    this.contact.update(this.base);
    this.tracking.update(this.base);
    this.forms.update(this.base);
    this.reports.update(this.base);
    this.files.update(this.base);
    this.search.update(this.base);
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