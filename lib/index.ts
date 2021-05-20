import XenquBase from "./XenquBase";
import AccountRoutes from "./Routes/AccountRoutes";
import TrackingRoutes from "./Routes/TrackingRoutes";
import ReportsRoutes from "./Routes/ReportsRoutes";
import SearchRoutes from "./Routes/SearchRoutes";
import ContactRoutes from "./Routes/ContactRoutes";
import FormsRoutes from "./Routes/FormsRoutes";
import FilesRoutes from "./Routes/FilesRoutes";
import OAuth1Credentials from "./Models/OAuth1Credentials";

// This has to be exported outside of the XenquAPI Object, since it requires no auth headers, and the response is required to init our XenquAPI object
/**
 *  /api/boot
 */
export const XenquAPIBoot = (baseUrl: string, appId: string, siteProfile: string): Promise<any> => {
  return fetch(baseUrl + '/boot', {
    method: "POST",
    mode: 'cors',
    headers: { 'Content-Type' : 'application/json' },
    body: JSON.stringify({appid: appId, site_profile: siteProfile}),
  }).then((res: Response) => {
    if (res.status > 199 && res.status < 210) {
      return res.json()
    } else {
      throw new Error(`Error at Boot Endpoint: ${res}`)
    }
  }).catch((err) => {
    throw err;
  })
}

export default class XenquAPI {

  /* Global Variables */
  private clientId: string;
  private clientSecret: string;
  private privateKey: string;
  private useWebFlowAuthentication: boolean;
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
   * @param noPK If you are using the web-stype authentication, and have no PK
   */
  constructor(clientId: string, clientSecret: string, privateKey?: string, subscriber?: string, url: string = 'https://xenqu.com/api', noPK: boolean = false) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.privateKey = privateKey || '';
    this.subscriber = subscriber || '';
    this.url = url;
    this.useWebFlowAuthentication = noPK
    this.base = new XenquBase(url, clientId, clientSecret, noPK);
  }

  /**
   * Initialize Connection to API using OAuth2.0
   */
  public init(): Promise<OAuth1Credentials> {
    if (!this.isInit) {
      if (!this.useWebFlowAuthentication) {
        return this.reauth();
      } else {
        throw new Error('Please Use startWebAuth()')
      }
    } else {
      throw new Error("Already initiated!")
    }
  }

  /**
   * Try to authenticate using old OAuth1.0 credentials, and will auto renew the token unless told not to
   * This is really only useful when using the web-style authentication, as we can auto-renew an OAuth2.0
   * token at any time. With the web style authentication, we would require the user to input their credentials
   * again, and that can be annoying.  If we can skip this process by trying to re-authenticate with an older
   * set of credentials, we can try.
   * @param credentials Old credentials to try and authenticate with
   * @param autoRenew Attempt to auto-renew the token and get a fresh set
   * @returns Currently active credentials
   */
  public tryOldCredentials(credentials: OAuth1Credentials, autoRenew: boolean = true): Promise<OAuth1Credentials> {
    if (!this.isInit) {
      // Update variables
      this.clientId = credentials.consumerKey;
      this.clientSecret = credentials.consumerSecret;
      this.base.setOAuth1Credentials(credentials);

      // Reauthenticate with credentials, if needed
      if (autoRenew) {
        return this.reauth();
      } else {
        this.updateRoutes();
        return new Promise<OAuth1Credentials>((resolve) => {resolve(this.base.getOAuth1Credentials())});
      }
    } else {
      throw new Error("Already initiated!")
    }
  }

  /**
   * Initialize Connection to API purely using Xenqu's OAuth1.0 flow
   * @param callback Callback URL
   * @returns Temp token for loading login iframe
   */
  public startWebAuth(callback: string): Promise<string> {
    if (!this.isInit) {
      if (!this.useWebFlowAuthentication) {
        throw new Error('Please Use initWebAuth()')
      } else {
        return this.base.requestToken(callback);
      }
    } else {
      throw new Error("Already initiated!")
    }
  }

  /**
   * Reauth Connection to API
   */
  public reauth(): Promise<OAuth1Credentials> {
    this.isInit = false;
    if (!this.useWebFlowAuthentication) {
      return this.base.makeOAuth2Request(this.clientId, this.clientSecret, this.subscriber, this.privateKey).then((success: boolean) => {
        this.updateRoutes();
        this.isInit = true;
        return this.base.getOAuth1Credentials();
      });
    } else {
      return this.base.refreshToken().then((success: boolean) => {
        this.updateRoutes();
        this.isInit = true;
        return this.base.getOAuth1Credentials();
      })
    }
  }

  /**
   * Finish Web-Style Authentication for Xenqu
   */
  public finishWebAuth(verifier: string): Promise<OAuth1Credentials> {
    this.isInit = false;
    if (this.useWebFlowAuthentication) {
      return this.base.accessToken(verifier).then((success: boolean) => {
        this.updateRoutes();
        this.isInit = true;
        return this.base.getOAuth1Credentials();
      })
    } else {
      throw new Error('Xenqu-Api was not initialized to use this authentication method! Please use init().')
    }
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
