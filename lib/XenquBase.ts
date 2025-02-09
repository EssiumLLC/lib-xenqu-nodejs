import fetch from 'cross-fetch';
import XenquApiError from "./Helpers/XenquApiError";
import { signJwt } from "./Helpers/jwt";
import * as SimpleOAuth from "./Helpers/simple-oauth";
import { OAuth1Credentials } from "./Models";
import OAuth2Token from "./Models/OAuth2Token";
import WebTokenAuth from "./Models/WebTokenAuth";

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
  // TODO: switch to event emitter...
  private errorCallbacks: { [key: string]: ((data?: XenquApiError) => void) | undefined };
  private oauth2RetryVars: { clientId: string, clientSecret: string, subscriber: string, privateKey: string };

  constructor(baseUrl: string, clientId?: string, clientSecret?: string, useWebAuth: boolean = false) {
    this.baseUrl = baseUrl;
    this.clientId = clientId || '';
    this.clientSecret = clientSecret || '';
    this.oauth = new OAuth2Token();
    this.webOauth = new WebTokenAuth();
    this.useWebAuth = useWebAuth;
    this.errorCallbacks = {};
  }

  /**
   * Make Get Request
   * @param path URL path to append
   * @param parameters Parameters that may get encoded into oath token
   */
  makeGet(path: string, parameters?: {}) {
    return this.makeGetRecursive(path, parameters);
  }

  /**
   * Get request recursive
   */
  private makeGetRecursive(path: string, parameters?: {}, retries: number = 0) {
    const params = parameters ? '?' + new URLSearchParams(parameters).toString() : '';
    return fetch(this.baseUrl + path + params, {
      method: "GET",
      headers: { 'authorization': this.getOAuth1Headers("GET", path, parameters) }
    }).then((res: Response) => {
      if (res.ok) {
        return res.json();
      } else if (res.status === 401 && retries < 1 && !this.useWebAuth) { // if we get 401, automatically retry auth
        return this.makeOAuth2Request(this.oauth2RetryVars.clientId, this.oauth2RetryVars.clientSecret, this.oauth2RetryVars.subscriber, this.oauth2RetryVars.privateKey).then(() => {
          return this.makeGetRecursive(path, parameters, retries + 1);
        })
      } else {
        throw res;
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
  makePost(path: string, payload?: string, parameters?: {}): Promise<any> {
    return this.makePostRecursive(path, payload, parameters, 0);
  }

  /**
   * Post Request recursive
   */
  private makePostRecursive(path: string, payload?: string, parameters?: {}, retries: number = 0): Promise<any> {
    const params = parameters ? '?' + new URLSearchParams(parameters).toString() : '';
    return fetch(this.baseUrl + path + params, {
      method: "POST",
      headers: { 'authorization': this.getOAuth1Headers("POST", path, parameters), "Content-Type": 'application/json' },
      body: payload,
    }).then((res: Response) => {
      if (res.ok) {
        return res.json()
      } else if (res.status === 401 && retries < 1 && !this.useWebAuth) { // if we get 401, automatically retry auth
        return this.makeOAuth2Request(this.oauth2RetryVars.clientId, this.oauth2RetryVars.clientSecret, this.oauth2RetryVars.subscriber, this.oauth2RetryVars.privateKey).then(() => {
          return this.makePostRecursive(path, payload, parameters, retries + 1);
        })
      } else {
        throw res;
      }
    }).then((json) => {
      if (Array.isArray(json.data)) {
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
  makePut(path: string, payload?: string, parameters?: {}): Promise<any> {
    return this.makePutRecursive(path, payload, parameters, 0);
  }

  /**
   * PUT request recursive
   */
  private makePutRecursive(path: string, payload?: string, parameters?: {}, retries: number = 0): Promise<any> {
    const params = parameters ? '?' + new URLSearchParams(parameters).toString() : '';
    return fetch(this.baseUrl + path + params, {
      method: "PUT",
      headers: { 'authorization': this.getOAuth1Headers("PUT", path, parameters), "Content-Type": 'application/json' },
      body: payload,
    }).then((res: Response) => {
      if (res.ok) {
        return res.json();
      } else if (res.status === 401 && retries < 1 && !this.useWebAuth) { // if we get 401, automatically retry auth
        return this.makeOAuth2Request(this.oauth2RetryVars.clientId, this.oauth2RetryVars.clientSecret, this.oauth2RetryVars.subscriber, this.oauth2RetryVars.privateKey).then(() => {
          return this.makePutRecursive(path, payload, parameters, retries + 1);
        })
      } else {
        throw res;
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
    return this.makeDeleteRecursive(path, payload, parameters, 0);
  }

  /**
   * Delete request recursive
   */
  private makeDeleteRecursive(path: string, payload?: string, parameters?: {}, retries: number = 0): Promise<any> {
    const params = parameters ? '?' + new URLSearchParams(parameters).toString() : '';
    return fetch(this.baseUrl + path + params, {
      method: "DELETE",
      headers: { 'authorization': this.getOAuth1Headers("DELETE", path, parameters), "Content-Type": 'application/json' },
      body: payload,
    }).then((res: Response) => {
      if (res.ok) {
        return res.json();
      } else if (res.status === 401 && retries < 1 && !this.useWebAuth) { // if we get 401, automatically retry auth
        return this.makeOAuth2Request(this.oauth2RetryVars.clientId, this.oauth2RetryVars.clientSecret, this.oauth2RetryVars.subscriber, this.oauth2RetryVars.privateKey).then(() => {
          return this.makeDeleteRecursive(path, payload, parameters, retries + 1);
        })
      } else {
        throw res;
      }
    }).catch((err) => {
      throw this.throwXenquApiError(err);
    })
  }

  /**
   *  Makes a request with OAuth2.0 Header to get OAuth1.0 headers to use in the rest of the API
   */
  async makeOAuth2Request(clientId: string, clientSecret: string, subscriber: string, privateKey: string): Promise<boolean> {
    this.oauth2RetryVars = { clientId: clientId, clientSecret: clientSecret, subscriber: subscriber, privateKey: privateKey }
    // Base 64 encode  for auth header
    const authorization = 'Basic ' + Buffer.from(this.clientId + ':' + this.clientSecret).toString('base64');
    const payload = {
      exp: (new Date()).getTime() / 1000 + 300,
      iss: clientId,
      aud: "https://xenqu.com",
      sub: subscriber,
    }
    const token = await signJwt(privateKey, payload);
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
      if (res.ok) {
        return res.json();
      } else {
        throw res;
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
    const oauth = this.getOauth1HeadersWebAuth('POST', url, false, callback);

    return fetch(url, {
      method: "POST",
      mode: 'cors',
      headers: { 'Authorization': oauth }
    }).then((res: Response) => {
      if (res.ok) {
        return res.text();
      } else {
        throw res;
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
    const oauth = this.getOauth1HeadersWebAuth('POST', url, true);

    return fetch(url, {
      method: "POST",
      mode: "cors",
      headers: { 'Authorization': oauth },
    }).then((res: Response) => {
      if (res.ok) {
        return res.text();
      } else {
        throw res;
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
    const oauth = this.useWebAuth ? this.getOauth1HeadersWebAuth("POST", url, true) : this.getOAuth1Headers('POST', url);

    return fetch(url, {
      method: "POST",
      mode: "cors",
      headers: { 'Authorization': oauth },
    }).then((res: Response) => {
      if (res.ok) {
        return res.text();
      } else {
        throw res;
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
  authenticate(clientId: string, clientSecret: string, callback: string, authenticator: 'default' | 'openid', additionalParameters: { user_name?: string, user_pass?: string, provider?: string, id_token?: string }): Promise<string> {
    const url = this.baseUrl + '/oauth/authenticate'
    const toSign = { ...additionalParameters, temp_token: this.webOauth.token, authenticator: authenticator } as any;
    const oauth = this.getOauth1HeadersWebAuth('POST', url, false, callback, toSign, clientId, clientSecret);
    let formData = ''
    for (const key in toSign) if (toSign.hasOwnProperty(key)) formData += `&${key}=${toSign[key]}`
    formData = formData.substr(1); // remove leading &

    return fetch(url, {
      method: "POST",
      mode: "cors",
      headers: { 'Authorization': oauth, 'content-type': 'application/x-www-form-urlencoded' },
      body: formData,
    }).then((res: Response) => {
      if (res.ok) {
        return res.text();
      } else {
        throw res;
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
    const oauth = this.getOauth1HeadersWebAuth('POST', url, false, callback, toSign, clientId, clientSecret);
    let formData = ''
    for (const key in toSign) if (toSign.hasOwnProperty(key)) formData += `&${key}=${toSign[key]}`
    formData = formData.substr(1); // remove leading &

    return fetch(url, {
      method: "POST",
      mode: "cors",
      headers: { 'Authorization': oauth, 'content-type': 'application/x-www-form-urlencoded' },
      body: formData,
    }).then((res: Response) => {
      if (res.ok) {
        return res.text();
      } else {
        throw res;
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
   * @param authCallback Callback URL to your application (sometimes different from 'callback')
   * @param authenticator Authentication method 'default for username/password, 'openid' for SSO applications
   * @param additionalParameters Additional parameters needed for the signin
   */
  authenticateWithSSOorUNandPW(clientId: string, clientSecret: string, callback: string, authCallback: string, authenticator: 'default' | 'openid', additionalParameters: { user_name?: string, user_pass?: string, provider?: string, id_token?: string }): Promise<boolean> {
    return this.requestToken(callback).then(() => {
      return this.authenticate(clientId, clientSecret, authCallback, authenticator, additionalParameters);
    }).then(() => {
      return this.authorize(clientId, clientSecret, authCallback);
    }).then((data: string) => {
      return this.accessToken(data.split('&')[1].split('=')[1]);
    })
  }

  /**
   * Get OAuth1.0 Credentials
   */
  getOAuth1Credentials(): OAuth1Credentials {
    return {
      consumer_key: this.clientId,
      consumer_secret: this.clientSecret,
      token: (!this.useWebAuth) ? this.oauth.token : this.webOauth.token,
      token_secret: (!this.useWebAuth) ? this.oauth.secret : this.webOauth.secret
    };
  }

  /**
   * Manually set OAuth1.0 credentials, rather than having them be set by an authentication flow
   * @param credentials Credentials to set
   */
  setOAuth1Credentials(credentials: OAuth1Credentials) {
    this.clientId = credentials.consumer_key;
    this.clientSecret = credentials.consumer_secret;
    if (!this.useWebAuth) {
      this.oauth.token = credentials.token;
      this.oauth.secret = credentials.token_secret;
    } else {
      this.webOauth.token = credentials.token;
      this.webOauth.secret = credentials.token_secret;
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
  private getOAuth1Headers(httpMethod: string, path: string, additionalParams?: { [key: string]: any }): string {
    const url = this.baseUrl + path;
    const keys = {
      consumer_key: this.clientId,
      consumer_secret: this.clientSecret,
      token: (!this.useWebAuth) ? this.oauth.token : this.webOauth.token,
      token_secret: (!this.useWebAuth) ? this.oauth.secret : this.webOauth.secret,
    }

    return new SimpleOAuth.Header(httpMethod.toUpperCase(), url, additionalParams, keys).build();
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
  private getOauth1HeadersWebAuth(httpMethod: string, url: string, signPersonally: boolean, callback?: string, additionalParams?: { [key: string]: any }, clientId?: string, clientSecret?: string): string {
    const keys = {
      consumer_key: (clientId) ? clientId : this.clientId,
      consumer_secret: (clientSecret) ? clientSecret : this.clientSecret,
      callback: callback,
      token: (signPersonally) ? this.webOauth.token : undefined,
      token_secret: (signPersonally) ? this.webOauth.secret : undefined,
      verifier: (signPersonally && this.webOauth.verifier !== '') ? this.webOauth.verifier : undefined
    }

    return new SimpleOAuth.Header(httpMethod.toUpperCase(), url, additionalParams, keys).build();
  }

  /**
   * Register an error handler with an ID
   * @param id Error Handler Identifier
   * @param callback Callback function
   * @private
   */
  registerErrorHandler(id: string, callback: (data?: XenquApiError) => void): { id: string } {
    this.errorCallbacks[id] = callback;
    return { id: id };
  }

  /**
   * Remove an error handler with an ID
   * @param id Error Handler Identifier
   * @private
   */
  unregisterErrorHandler(id: string): { id: string } {
    this.errorCallbacks[id] = undefined;
    return { id: id };
  }

  /**
   * Execute all error handlers
   * error: Xenqu Error to return to callback
   * @private
   */
  private executeAllErrorHandlers(error: XenquApiError) {
    Object.keys(this.errorCallbacks).forEach((key: string) => {
      try {
        if (this.errorCallbacks[key] && typeof this.errorCallbacks[key] === "function") {
          // @ts-expect-error this isn't an error but the compiler seems to think it is. and now intelisense thinks this is an error -_-
          this.errorCallbacks[key](error);
        }
      } catch (e) {
        console.error("Error Handler Failed: ", e);
      }
    })
  }

  private throwXenquApiError(error: any) {
    if (typeof error === 'object' && error.url !== undefined && error.status !== undefined) {
      const e = new XenquApiError(error);
      this.executeAllErrorHandlers(e);
      return e;
    } else if (typeof error === 'object') {
      error._error_name_ = "XenquAPI";
      return error;
    } else {
      return error
    }
  }
}
