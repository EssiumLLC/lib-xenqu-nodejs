export default class OAuth1Credentials {
  private _consumerKey: string;
  private _consumerSecret: string;
  private _token: string;
  private _secret: string;

  /**
   * Optionally initialize this model with JSON data
   * @param json
   */
  constructor(json?: any) {
    this._consumerKey = '';
    this._consumerSecret = '';
    this._token = '';
    this._secret = '';
    if(json) this.fromJson(json)
  }

  fromJson(json: any) {
    this._consumerKey = json.consumer_key;
    this._consumerSecret = json.consumer_secret;
    this._token = json.token;
    this._secret = json.token_secret;
  }

  toJson(): any {
    return {
      consumer_key: this.consumerKey,
      consumer_secret: this.consumerSecret,
      token: this.token,
      token_secret: this.secret,
    }
  }

  get consumerKey(): string {
    return this._consumerKey;
  }

  set consumerKey(value: string) {
    this._consumerKey = value;
  }

  get consumerSecret(): string {
    return this._consumerSecret;
  }

  set consumerSecret(value: string) {
    this._consumerSecret = value;
  }

  get token(): string {
    return this._token;
  }

  get secret(): string {
    return this._secret;
  }
}
