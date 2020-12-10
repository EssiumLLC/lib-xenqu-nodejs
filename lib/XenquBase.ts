import OAuth2Token from "./Models/OAuth2Token";
import {randomBytes} from 'crypto'
import axios, {AxiosResponse} from 'axios'
// @ts-ignore
import { rfc3986, sign } from "oauth-sign";
import * as jwt from "jsonwebtoken";


/*
Base for making HTTP requests
 */

export default class XenquBase {

  /* Global Variables */
  private baseUrl: string;
  private clientId: string;
  private clientSecret: string;
  private oauth: OAuth2Token;

  constructor(baseUrl: string, clientId?: string, clientSecret?: string) {
    this.baseUrl = baseUrl;
    this.clientId = clientId || '';
    this.clientSecret = clientSecret || '';
    this.oauth = new OAuth2Token();
  }

  /**
   * Update Oath Parameters
   * @param oath Oath Information
   */
  updateOath(oath: OAuth2Token) {
    this.oauth = oath;
  }

  /**
   * Make Get Request
   * @param path URL path to append
   * @param parameters Parameters that may get encoded into oath token
   */
  makeGet(path: string, parameters?: any[]) {
    return axios(this.baseUrl + path, {
      method: "GET",
      headers: {'authorization': this.getOath1Headers("GET", path, parameters)}
    }).then((res: AxiosResponse<any>) => {
        if(res.status > 199 && res.status < 210) {
          return res.data;
        } else {
          throw new Error(`Error Authorizing (${res.status}: ${res.statusText}): ${res.data}`)
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
  makePost(path: string, payload: string, parameters?: any[]): Promise<any> {
    return axios(this.baseUrl + path, {
      method: "POST",
      headers: {'authorization': this.getOath1Headers("POST", path, parameters), "Content-Type": 'application/json'},
      data: payload,
      responseType: 'json'
    }).then((res: AxiosResponse<any>) => {
      if (res.status > 199 && res.status < 210) {
        if(Array.isArray(res.data.data)) {
          return res.data.data;
        } else {
          return res.data;
        }
      } else {
        throw new Error(`Error at OAuth 2.0 Endpoint: ${res.data}`)
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
  makePut(path: string, payload: string, parameters?: any[]): Promise<any> {
    return axios(this.baseUrl + path, {
      method: "PUT",
      headers: {'authorization': this.getOath1Headers("PUT", path, parameters), "Content-Type": 'application/json'},
      data: payload,
      responseType: 'json'
    }).then((res: AxiosResponse<any>) => {
      if (res.status > 199 && res.status < 210) {
        return res.data;
      } else {
        throw new Error(`Error at OAuth 2.0 Endpoint: ${res.data}`)
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
  makeDelete(path: string, payload?: string, parameters?: any[]): Promise<any> {
    return axios(this.baseUrl + path, {
      method: "DELETE",
      headers: {'authorization': this.getOath1Headers("DELETE", path, parameters), "Content-Type": 'application/json'},
      data: payload,
      responseType: 'json'
    }).then((res: AxiosResponse<any>) => {
      if (res.status > 199 && res.status < 210) {
        return res.data;
      } else {
        throw new Error(`Error at OAuth 2.0 Endpoint: ${res.data}`)
      }
    }).catch((err) => {
      throw this.throwXenquApiError(err);
    })
  }

  /**
   *
   */
  makeOath2Request(clientId: string, clientSecret: string, subscriber: string, privateKey: string): Promise<OAuth2Token> {
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

    return axios(this.baseUrl + '/oauth2/token', {
      method: "POST",
      headers: headers,
      data: body,
      responseType: 'json'
    }).then((res: AxiosResponse<any>) => {
      if (res.status > 199 && res.status < 210) {
        return new OAuth2Token(res.data);
      } else {
        throw new Error(`Error at OAuth 2.0 Endpoint: ${res.data}`)
      }
    }).catch((err) => {
      throw this.throwXenquApiError(err);
    })
  }

  private getOath1Headers(httpMethod: string, path: string, additionalParams?: any[]): string {
    const url = this.baseUrl + path;
    const p: any = {
        oauth_consumer_key : this.clientId,
        oauth_token : this.oauth.token,
        oauth_nonce : randomBytes(12).toString('base64'),
        oauth_timestamp : (Math.floor(Date.now() / 1000)),
        oauth_signature_method : 'HMAC-SHA1',
        oauth_version : '1.0',
      ... additionalParams
      };
    const sig = sign('HMAC-SHA1', httpMethod, url, p, this.clientSecret, this.oauth.secret);
    return `OAuth oauth_consumer_key="${p.oauth_consumer_key}",oauth_token="${p.oauth_token}",oauth_signature_method="${p.oauth_signature_method}",oauth_timestamp="${p.oauth_timestamp}",oauth_nonce="${p.oauth_nonce}",oauth_version="${p.oauth_version}",oauth_signature="${sig}"`;
  }

  private throwXenquApiError(error: any) {
    const e = new Error(error);
    e.name = '\n XenquAPI';
    e.message = 'Received non-200 from API || [' + error.response.status + ']: ' + error.response.statusText +
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