import Oath2Token from "./Models/Oath2Token";
import {randomBytes} from 'crypto'
import axios, {AxiosResponse} from 'axios'
// @ts-ignore
import { rfc3986, sign } from "oauth-sign";


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

  updateOath(oath: Oath2Token) {
    this.oath = oath;
  }

  makeGet(path: string, parameters?: any[]) {

    return axios(this.baseUrl + path, {
      method: "GET",
      headers: {'authorization': this.getOathHeaders("GET", path, undefined, parameters)}
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

  makeOathRequest(path: string, headers: any, payload: string): Promise<Oath2Token> {
    return axios(this.baseUrl + path, {
      method: "POST",
      headers: headers,
      data: payload,
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

  makePut() {

  }

  private getOathHeaders(httpMethod: string, path: string, payload?: any, additionalParams?: any[]): string {
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