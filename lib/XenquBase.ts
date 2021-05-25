import OAuth2Token from "./Models/OAuth2Token";
import * as jwt from "jsonwebtoken";
import WebTokenAuth from "./Models/WebTokenAuth";
import OAuth1Credentials from "./Models/OAuth1Credentials";
// Simple OAuth from github.com/bseth99/simple-oauth-js
const SimpleOAuth = require('./Helpers/simple-oauth')


/*
Base for making HTTP requests
 */

export default class XenquBase {

  /* Global Variables */
  private baseUrl: string;
  private clientId: string;
  private clientSecret: string;
  private oauth: OAuth2Token;
  private webOauth: WebTokenAuth;
  private useWebAuth: boolean;

  constructor(baseUrl: string, clientId?: string, clientSecret?: string, useWebAuth: boolean = false) {
    this.baseUrl = baseUrl;
    this.clientId = clientId || '';
    this.clientSecret = clientSecret || '';
    this.oauth = new OAuth2Token();
    this.webOauth = new WebTokenAuth();
    this.useWebAuth = useWebAuth;
  }

  /**
   * Make Get Request
   * @param path URL path to append
   * @param parameters Parameters that may get encoded into oath token
   */
  makeGet(path: string, parameters?: {}) {
    const params = parameters ? '?' + new URLSearchParams(parameters).toString() : '';
    return fetch(this.baseUrl + path + params, {
      method: "GET",
      headers: {'authorization': this.getOath1Headers("GET", path, parameters)}
    }).then((res: Response) => {
        if(res.status > 199 && res.status < 210) {
          return res.json();
        } else {
          throw new Error(`Error Authorizing (${res.status}: ${res.statusText}): ${res}`)
        }
    }).catch((error) => {
      throw this.throwXenquApiError(error);
    })
  }

  /**
   * Make POST request
   * @param path URL path to append
   * @param payload Stringified JSON data to send
   * @param parameters Parameters that may get encoded into oath token
   */
  makePost(path: string, payload: string, parameters?: {}): Promise<any> {
    const params = parameters ? '?' + new URLSearchParams(parameters).toString() : '';
    return fetch(this.baseUrl + path + params, {
      method: "POST",
      headers: {'authorization': this.getOath1Headers("POST", path, parameters), "Content-Type": 'application/json'},
      body: payload,
    }).then((res: Response) => {
      if (res.status > 199 && res.status < 210) {
        return res.json()
      } else {
        throw new Error(`Error at OAuth 2.0 Endpoint: ${res}`)
      }
    }).then((json) => {
      if(Array.isArray(json.data)) {
        return json.data;
      } else {
        return json;
      }
    }).catch((err) => {
      throw this.throwXenquApiError(err);
    })
  }

  /**
   * Make PUT request
   * @param path URL path to append
   * @param payload Stringified JSON data to send
   * @param parameters Parameters that may get encoded into oath token
   */
  makePut(path: string, payload: string, parameters?: {}): Promise<any> {
    const params = parameters ? '?' + new URLSearchParams(parameters).toString() : '';
    return fetch(this.baseUrl + path + params, {
      method: "PUT",
      headers: {'authorization': this.getOath1Headers("PUT", path, parameters), "Content-Type": 'application/json'},
      body: payload,
    }).then((res: Response) => {
      if (res.status > 199 && res.status < 210) {
        return res.json();
      } else {
        throw new Error(`Error at OAuth 2.0 Endpoint: ${res}`)
      }
    }).catch((err) => {
      throw this.throwXenquApiError(err);
    })
  }

  /**
   * Make Delete request
   * @param path URL path to append
   * @param payload optional Stringified JSON data to send
   * @param parameters Parameters that may get encoded into oath token
   */
  makeDelete(path: string, payload?: string, parameters?: {}): Promise<any> {
    const params = parameters ? '?' + new URLSearchParams(parameters).toString() : '';
    return fetch(this.baseUrl + path + params, {
      method: "DELETE",
      headers: {'authorization': this.getOath1Headers("DELETE", path, parameters), "Content-Type": 'application/json'},
      body: payload,
    }).then((res: Response) => {
      if (res.status > 199 && res.status < 210) {
        return res.json();
      } else {
        throw new Error(`Error at OAuth 2.0 Endpoint: ${res}`)
      }
    }).catch((err) => {
      throw this.throwXenquApiError(err);
    })
  }

  /**
   *  Makes a request with OAuth2.0 Header to get OAuth1.0 headers to use in the rest of the API
   */
  makeOAuth2Request(clientId: string, clientSecret: string, subscriber: string, privateKey: string): Promise<boolean> {
    // Base 64 encode  for auth header
    const authorization = 'Basic ' + Buffer.from(this.clientId + ':' + this.clientSecret).toString('base64');
    const payload = {
      exp: (new Date()).getTime() / 1000 + 300,
      iss: clientId,
      aud: "https://xenqu.com",
      sub: subscriber,
    }
    const token = jwt.sign(payload, privateKey, {algorithm: "RS256"})
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': authorization
    }
    const body = 'grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=' + token;

    return fetch(this.baseUrl + '/oauth2/token', {
      method: "POST",
      headers: headers,
      body: body
    }).then((res: Response) => {
      if (res.status > 199 && res.status < 210) {
        return res.json();
      } else {
        throw new Error(`Error at OAuth 2.0 Endpoint: ${res}`)
      }
    }).then((json) => {
      this.oauth = new OAuth2Token(json)
      return true
    }).catch((err) => {
      throw this.throwXenquApiError(err);
    })
  }

  /**
   *  Makes a request to get a token
   */
  requestToken(callback: string): Promise<any> {
    const url = this.baseUrl + '/oauth/request_token'
    const oauth = this.getOath1HeadersWebAuth('POST', url, false, callback);

    return fetch(url, {
      method: "POST",
      mode: 'cors',
      headers: {'Authorization': oauth}
    }).then((res: Response) => {
      if (res.status > 199 && res.status < 210) {
        return res.text();
      } else {
        throw new Error(`Error at /oauth/request_token Endpoint: ${res}`)
      }
    }).then((text: string) => {
      this.webOauth = new WebTokenAuth(text)
      return this.webOauth.token;
    }).catch((err) => {
      throw this.throwXenquApiError(err);
    })
  }

  /**
   *  Makes a request with a token verifier to get our personal signing stuffs
   */
  accessToken(verifier: string): Promise<boolean> {
    const url = this.baseUrl + '/oauth/access_token'
    this.webOauth.verifier = verifier;
    const oauth = this.getOath1HeadersWebAuth('POST', url, true);

    return fetch(url, {
      method: "POST",
      mode: "cors",
      headers: { 'Authorization': oauth },
    }).then((res: Response) => {
      if (res.status > 199 && res.status < 210) {
        return res.text();
      } else {
        throw new Error(`Error at /oauth/access_token Endpoint: ${res}`)
      }
    }).then((text: string) => {
      this.webOauth = new WebTokenAuth(text);
      return true;
    }).catch((err) => {
      throw this.throwXenquApiError(err);
    })
  }

  /**
   *  Makes a request to refresh the OAuth1.0 token
   */
  refreshToken(): Promise<boolean> {
    const url = this.baseUrl + '/oauth/renew_token'
    const oauth = this.getOath1Headers('POST', url);

    return fetch(url, {
      method: "POST",
      mode: "cors",
      headers: { 'Authorization': oauth },
    }).then((res: Response) => {
      if (res.status > 199 && res.status < 210) {
        return res.text();
      } else {
        throw new Error(`Error at /oauth/renew_token Endpoint: ${res}`)
      }
    }).then((text) => {
      this.webOauth = new WebTokenAuth(text);
      return true;
    }).catch((err) => {
      throw this.throwXenquApiError(err);
    })
  }

  /**
   * Authenticate with SSO or Login data
   * @param clientId Typically, the /authenticate and /authorize oauth routes are protected under a different client key and secret.
   * @param clientSecret Typically, the /authenticate and /authorize oauth routes are protected under a different client key and secret.
   * @param callback Callback URL to your application (this doesn't really matter, as none of the callbacks are needed in this process)
   * @param authenticator Authentication method 'default for username/password, 'openid' for SSO applications
   * @param additionalParameters Additional parameters needed for the signin
   */
  authenticate(clientId: string, clientSecret: string, callback: string, authenticator: 'default' | 'openid', additionalParameters: {user_name?: string, user_pass?: string, provider?: string, id_token?: string}): Promise<string> {
    const url = this.baseUrl + '/oauth/authenticate'
    const toSign = {...additionalParameters, temp_token: this.webOauth.token, authenticator: authenticator} as any;
    const oauth = this.getOath1HeadersWebAuth('POST', url, false, callback, toSign, clientId, clientSecret);
    let formData = ''
    for (const key in toSign) if(toSign.hasOwnProperty(key)) formData += `&${key}=${toSign[key]}`
    formData = formData.substr(1); // remove leading &

    return fetch(url, {
      method: "POST",
      mode: "cors",
      headers: { 'Authorization': oauth, 'content-type': 'application/x-www-form-urlencoded' },
      body: formData,
    }).then((res: Response) => {
      if (res.status > 199 && res.status < 210) {
        return res.text();
      } else {
        throw new Error(`Error at /oauth/authenticate Endpoint: ${res}`)
      }
    }).then((text: string) => {
      return text;
    }).catch((err) => {
      throw this.throwXenquApiError(err);
    })
  }

  /**
   *  After calling authenticate, you can authorize your temp_token
   */
  authorize(clientId: string, clientSecret: string, callback: string): Promise<string> {
    const url = this.baseUrl + '/oauth/authorize'
    const toSign = { temp_token: this.webOauth.token } as any;
    const oauth = this.getOath1HeadersWebAuth('POST', url, false, callback, toSign, clientId, clientSecret);
    let formData = ''
    for (const key in toSign) if(toSign.hasOwnProperty(key)) formData += `&${key}=${toSign[key]}`
    formData = formData.substr(1); // remove leading &

    return fetch(url, {
      method: "POST",
      mode: "cors",
      headers: { 'Authorization': oauth, 'content-type': 'application/x-www-form-urlencoded' },
      body: formData,
    }).then((res: Response) => {
      if (res.status > 199 && res.status < 210) {
        return res.text();
      } else {
        throw new Error(`Error at /oauth/authorize Endpoint: ${res}`)
      }
    }).then((text: string) => {
      return text;
    }).catch((err) => {
      throw this.throwXenquApiError(err);
    })
  }

  /**
   * Attempt to run through the whole authentication process using SSO or Username/password credentials
   * @param clientId Typically, the /authenticate and /authorize oauth routes are protected under a different client key and secret.
   * @param clientSecret Typically, the /authenticate and /authorize oauth routes are protected under a different client key and secret.
   * @param callback Callback URL to your application (this doesn't really matter, as none of the callbacks are needed in this process)
   * @param authenticator Authentication method 'default for username/password, 'openid' for SSO applications
   * @param additionalParameters Additional parameters needed for the signin
   */
  authenticateWithSSOorUNandPW(clientId: string, clientSecret: string, callback: string, authenticator: 'default' | 'openid', additionalParameters: {user_name?: string, user_pass?: string, provider?: string, id_token?: string}): Promise<boolean> {
    return this.requestToken(callback).then(() => {
      return this.authenticate(clientId, clientSecret, callback, authenticator, additionalParameters);
    }).then(() => {
      return this.authorize(clientId, clientSecret, callback);
    }).then((data: string) => {
      return this.accessToken(data.split('&')[1].split('=')[1]);
    })
  }

  /**
   * Get OAuth1.0 Credentials
   */
  getOAuth1Credentials(): OAuth1Credentials {
    const creds = {
      consumer_key: this.clientId,
      consumer_secret: this.clientSecret,
      token: (!this.useWebAuth) ? this.oauth.token : this.webOauth.token,
      token_secret: (!this.useWebAuth) ? this.oauth.secret : this.webOauth.secret
    }
    return new OAuth1Credentials(creds);
  }

  /**
   * Manually set OAuth1.0 credentials, rather than having them be set by an authentication flow
   * @param credentials Credentials to set
   */
  setOAuth1Credentials(credentials: OAuth1Credentials) {
    this.clientId = credentials.consumerKey;
    this.clientSecret = credentials.consumerSecret;
    if (!this.useWebAuth) {
      this.oauth.token = credentials.token;
      this.oauth.secret = credentials.secret;
    } else {
      this.webOauth.token = credentials.token;
      this.webOauth.secret = credentials.secret;
      this.webOauth.verifier = '';
    }
  }

  /**
   * Generate OAuth1.0 Headers for General API requests
   * @param httpMethod Request Method
   * @param path URL Path
   * @param additionalParams Any query parameters used in the
   * @private
   */
  private getOath1Headers(httpMethod: string, path: string, additionalParams?: {} ): string {
    const url = this.baseUrl + path;
    const keys = {
      consumer_key: this.clientId,
      consumer_secret: this.clientSecret,
      token:        (!this.useWebAuth) ? this.oauth.token : this.webOauth.token,
      token_secret: (!this.useWebAuth) ? this.oauth.secret : this.webOauth.secret,
    }
    const oauth = new SimpleOAuth.Header(httpMethod.toUpperCase(), url, additionalParams, keys);
    return oauth.build();
  }

  /**
   * Headers used when accessing RequestToken, AccessToken, or RefreshToken
   * @param httpMethod Query Method
   * @param url Full Request URL (not just path)
   * @param signPersonally If true, token will be signed with token, token_secret, and token_verifier
   * @param callback Callback URL, if required
   * @param additionalParams Any query parameters
   * @param clientId Override Client ID
   * @param clientSecret Override Client Secret
   * @private
   */
  private getOath1HeadersWebAuth(httpMethod: string, url: string, signPersonally: boolean, callback?: string, additionalParams?: {[key: string]: any}, clientId?: string, clientSecret?: string): string {
    const keys = {
      consumer_key: (clientId) ? clientId : this.clientId,
      consumer_secret: (clientSecret) ? clientSecret : this.clientSecret,
      callback: callback,
      token:        (signPersonally) ? this.webOauth.token : undefined,
      token_secret: (signPersonally) ? this.webOauth.secret : undefined,
      verifier:     (signPersonally && this.webOauth.verifier !== '') ? this.webOauth.verifier : undefined
    }
    const oauth = new SimpleOAuth.Header(httpMethod.toUpperCase(), url, additionalParams, keys);
    return oauth.build()
  }

  private throwXenquApiError(error: any) {
    const e = new Error(error);
    e.name = '\n XenquAPI';
    e.message =
      '\n Message: Received non-200 from API' +
      '\n URL: ' + error.config.method + ' ' + error.config.url +
      '\n Response Code: [' + error.response.status + '] ' + error.response.statusText +
      '\n Response Message: ' + error.response.data;
    switch(error.response.status) {
      case 400: e.name = '\n XenquBadRequest'; break;
      case 401: e.name = '\n XenquUnauthorized'; break;
      case 403: e.name = '\n XenquForbidden'; break;
      case 404: e.name = '\n XenquNotFound'; break;
      case 500: e.name = '\n XenquInternalServerError'; break;
    }
    return e;
  }
}
