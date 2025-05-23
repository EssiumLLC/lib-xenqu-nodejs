import XenquBase from "./XenquBase";
import AccountRoutes from "./Routes/AccountRoutes";
import TrackingRoutes from "./Routes/TrackingRoutes";
import ReportsRoutes from "./Routes/ReportsRoutes";
import SearchRoutes from "./Routes/SearchRoutes";
import ContactRoutes from "./Routes/ContactRoutes";
import FormsRoutes from "./Routes/FormsRoutes";
import FilesRoutes from "./Routes/FilesRoutes";
import { OAuth1Credentials, Boot } from "./Models";
import XenquApiError from "./Helpers/XenquApiError";
import { AdditionalLoginParameters } from "./Interfaces";
import BillingRoutes from "./Routes/BillingRoutes";
import HelpCenterRoutes from "./Routes/HelpCenterRoutes";

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
  private _account: AccountRoutes = new AccountRoutes();
  private _contact: ContactRoutes = new ContactRoutes();
  private _tracking: TrackingRoutes = new TrackingRoutes();
  private _forms: FormsRoutes = new FormsRoutes();
  private _reports: ReportsRoutes = new ReportsRoutes();
  private _files: FilesRoutes = new FilesRoutes();
  private _search: SearchRoutes = new SearchRoutes();
  private _billing: BillingRoutes = new BillingRoutes();
  private _helpCenter: HelpCenterRoutes = new HelpCenterRoutes();

  /* Static instance of XenquBase */
  static Base: XenquBase;

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
    XenquAPI.Base = new XenquBase(url, clientId, clientSecret, noPK);
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
   * Boot Xenqu API, get required headers for authentication
   * @param baseUrl Base Xenqu URL
   * @param appId Xenqu App ID
   * @param siteProfile Site Profile ID
   * @returns Boot
   */
  public static boot(baseUrl: string, appId: string, siteProfile: string): Promise<Boot> {
    return fetch(baseUrl + '/boot', {
      method: "POST",
      mode: 'cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ appid: appId, site_profile: siteProfile }),
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
      this.clientId = credentials.consumer_key;
      this.clientSecret = credentials.consumer_secret;
      XenquAPI.Base.setOAuth1Credentials(credentials);

      // Reauthenticate with credentials, if needed
      if (autoRenew) {
        return this.reauth();
      } else {
        return new Promise<OAuth1Credentials>((resolve) => { resolve(XenquAPI.Base.getOAuth1Credentials()) });
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
        return XenquAPI.Base.requestToken(callback);
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
      return XenquAPI.Base.makeOAuth2Request(this.clientId, this.clientSecret, this.subscriber, this.privateKey).then(() => {
        this.isInit = true;
        return XenquAPI.Base.getOAuth1Credentials();
      });
    } else {
      return XenquAPI.Base.refreshToken().then(() => {
        this.isInit = true;
        return XenquAPI.Base.getOAuth1Credentials();
      })
    }
  }

  /**
   * Authenticate a token with UN/PW or SSO data
   * @param clientId Typically, the /authenticate and /authorize oauth routes are protected under a different client key and secret.
   * @param clientSecret Typically, the /authenticate and /authorize oauth routes are protected under a different client key and secret.
   * @param callback Callback URL to your application (this doesn't really matter, as none of the callbacks are needed in this process)
   * @param authenticator Authentication method 'default for username/password, 'openid' for SSO applications
   * @param additionalParameters Additional parameters needed for the signin
   */
  public authenticate(clientId: string, clientSecret: string, callback: string, authenticator: 'default' | 'openid', additionalParameters: AdditionalLoginParameters): Promise<string> {
    if (this.useWebFlowAuthentication) {
      return XenquAPI.Base.authenticate(clientId, clientSecret, callback, authenticator, additionalParameters)
    } else {
      throw new Error('Xenqu-Api was not initialized to use this authentication method! Please use init().')
    }
  }

  /**
   * Authorize the temp_token from startWebAuth
   * @param clientId Typically, the /authenticate and /authorize oauth routes are protected under a different client key and secret.
   * @param clientSecret Typically, the /authenticate and /authorize oauth routes are protected under a different client key and secret.
   * @param callback Callback URL to your application (this doesn't really matter, as none of the callbacks are needed in this process)
   */
  public authorize(clientId: string, clientSecret: string, callback: string): Promise<string> {
    if (this.useWebFlowAuthentication) {
      return XenquAPI.Base.authorize(clientId, clientSecret, callback);
    } else {
      throw new Error('Xenqu-Api was not initialized to use this authentication method! Please use init().')
    }
  }

  /**
   * Finish Web-Style Authentication for Xenqu
   * @param verifier Verifier token returned from login
   */
  public finishWebAuth(verifier: string): Promise<OAuth1Credentials> {
    this.isInit = false;
    if (this.useWebFlowAuthentication) {
      return XenquAPI.Base.accessToken(verifier).then(() => {
        this.isInit = true;
        return XenquAPI.Base.getOAuth1Credentials();
      })
    } else {
      throw new Error('Xenqu-Api was not initialized to use this authentication method! Please use init().')
    }
  }

  /**
   * Attempt to run through the whole authentication process using SSO or Username/password credentials
   * @param clientId Typically, the /authenticate and /authorize oauth routes are protected under a different client key and secret.
   * @param clientSecret Typically, the /authenticate and /authorize oauth routes are protected under a different client key and secret.
   * @param callback Callback URL to your application (this doesn't really matter, as none of the callbacks are needed in this process)
   * @param authCallback Callback URL to your application (sometimes different from 'callback')
   * @param authenticator Authentication method 'default for username/password, 'openid' for SSO applications
   * @param additionalParameters Additional parameters needed for the signin
   */
  public attemptAuthWithUNandPWorSSO(clientId: string, clientSecret: string, callback: string, authCallback: string, authenticator: 'default' | 'openid', additionalParameters: { user_name?: string, user_pass?: string, provider?: string, id_token?: string }): Promise<OAuth1Credentials> {
    this.isInit = false;
    if (this.useWebFlowAuthentication) {
      return XenquAPI.Base.authenticateWithSSOorUNandPW(clientId, clientSecret, callback, authCallback, authenticator, additionalParameters).then(() => {
        this.isInit = true;
        return XenquAPI.Base.getOAuth1Credentials();
      })
    } else {
      throw new Error('Xenqu-Api was not initialized to use this authentication method! Please use init().')
    }
  }

  /**
   * Add an id-based callback for when XenquAPI errors (ONLY XenquAPIErrors are included in this callback)
   * @param id An Identifier for your callback
   * @param callback Callback function
   */
  public addErrorHandler(id: string, callback: (data?: XenquApiError) => void): { id: string } {
    return XenquAPI.Base.registerErrorHandler(id, callback);
  }

  /**
   * Remove an id-based error callback
   * @param id identifier for your callback
   */
  public removeErrorHandler(id: string): { id: string } {
    return XenquAPI.Base.unregisterErrorHandler(id);
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
  /**
   * Get Billing Routes
   */
  get billing() {
    return this._billing;
  }
  /**
   * Get Help Center Routes
   */
  get helpCenter() {
    return this._helpCenter;
  }
}
