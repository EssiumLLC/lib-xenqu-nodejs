import Oath2Token from "./Models/Oath2Token";
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
  private oath: Oath2Token;

  constructor(baseUrl: string, clientId?: string, clientSecret?: string) {
    this.baseUrl = baseUrl;
    this.clientId = clientId || '';
    this.clientSecret = clientSecret || '';
    this.oath = new Oath2Token();
  }

  /**
   * Update Oath Parameters
   * @param oath Oath Information
   */
  updateOath(oath: Oath2Token) {
    this.oath = oath;
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
    }).catch((error: any) => {
      throw new Error(error)
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
      throw new Error(err)
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
      throw new Error(err)
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
      throw new Error(err)
    })
  }

  /**
   *
   */
  makeOath2Request(clientId: string, clientSecret: string, subscriber: string, privateKey: string): Promise<Oath2Token> {
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
        return new Oath2Token(res.data);
      } else {
        throw new Error(`Error at OAuth 2.0 Endpoint: ${res.data}`)
      }
    }).catch((err) => {
      throw new Error(err)
    })
  }

  private getOath1Headers(httpMethod: string, path: string, additionalParams?: any[]): string {
    const url = this.baseUrl + path;
    const p: any = {
        oauth_consumer_key : this.clientId,
        oauth_token : this.oath.token,
        oauth_nonce : randomBytes(12).toString('base64'),
        oauth_timestamp : (Math.floor(Date.now() / 1000)),
        oauth_signature_method : 'HMAC-SHA1',
        oauth_version : '1.0',
      ... additionalParams
      };
    const sig = sign('HMAC-SHA1', httpMethod, url, p, this.clientSecret, this.oath.secret);
    return `OAuth oauth_consumer_key="${p.oauth_consumer_key}",oauth_token="${p.oauth_token}",oauth_signature_method="${p.oauth_signature_method}",oauth_timestamp="${p.oauth_timestamp}",oauth_nonce="${p.oauth_nonce}",oauth_version="${p.oauth_version}",oauth_signature="${sig}"`;
  }
}