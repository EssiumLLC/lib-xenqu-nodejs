export default class WebTokenAuth {
  private _token: string;
  private _secret: string;
  private _verifier: string;

  constructor(formData?: any) {
    this._token = '';
    this._secret = '';
    this._verifier = '';
    if(formData) this.fromFormData(formData);
  }

  private fromFormData(formData: any) {
    if (formData) {
      const split1 = formData.split("&");
      if (split1.length > 0) {
        const split2 = split1[0].split("=");  // oauth_token
        if (split2.length > 0) this._token = split2[1];
        const split3 = split1[1].split("=");  // oauth_token_secret
        if (split3.length > 0) this._secret = split3[1];
      }
    }
  }

  get token(): string {
    return this._token;
  }

  set token(value: string) {
    this._token = value;
  }

  get secret(): string {
    return this._secret;
  }

  set secret(value: string) {
    this._secret = value;
  }

  set verifier(verifier: string) {
    this._verifier = verifier
  }

  get verifier(): string {
    return this._verifier;
  }
}
