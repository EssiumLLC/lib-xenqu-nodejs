export default class OAuth2Token {
  private _token: string;
  private _secret: string;
  private _expires: Date;

  constructor(json?: any) {
    this._token = '';
    this._secret = '';
    this._expires = new Date(0);
    if(json) this.fromJson(json);
  }

  private fromJson(json: any) {
    this._token = json.token;
    this._secret = json.token_secret;
    this._expires = new Date(json.expires * 1000);
  }

  get token(): string {
    return this._token;
  }

  get secret(): string {
    return this._secret;
  }

  get expires(): Date {
    return this._expires;
  }
}