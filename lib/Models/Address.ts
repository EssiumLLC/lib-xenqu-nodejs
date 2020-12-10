export default class Address {
  private _order: number;
  private _usage: string;
  private _street1: string;
  private _street2: string;
  private _street3: string;
  private _region1: string;
  private _region2: string;
  private _postalcode: string;
  private _country: string;
  private _validFrom: string;
  private _validTo: string;

  constructor(order?: number, usage?: string, street1?: string, street2?: string, street3?: string, region1?: string, region2?: string, postalcode?: string, country?: string, validFrom?: string, validTo?: string) {
    this._order = order || -1;
    this._usage = usage || "";
    this._street1 = street1 || "";
    this._street2 = street2 || "";
    this._street3 = street3 || "";
    this._region1 = region1 || "";
    this._region2 = region2 || "";
    this._postalcode = postalcode || "";
    this._country = country || "";
    this._validFrom = validFrom || "";
    this._validTo = validTo || "";
  }

  toJson(): any {
    return {
      order: this.order,
      usage: this.usage,
      street1: this.street1,
      street2: this.street2,
      street3: this.street3,
      region1: this.region1,
      region2: this.region2,
      postalcode: this.postalcode,
      country: this.country,
      valid_from: this.validFrom,
      valid_to: this.validTo
    }
  }

  fromJson(json: any): Address {
    this.order = json.order;
    this.usage = json.usage;
    this.street1 = json.street1;
    this.street2 = json.street2;
    this.street3 = json.street3;
    this.region1 = json.region1;
    this.region2 = json.region2;
    this.postalcode = json.postalcode;
    this.country = json.country;
    this.validFrom = json.validFrom;
    this.validTo = json.validTo;
    return this;
  }

  get order(): number {
    return this._order;
  }

  set order(value: number) {
    this._order = value;
  }

  get usage(): string {
    return this._usage;
  }

  set usage(value: string) {
    this._usage = value;
  }

  get street1(): string {
    return this._street1;
  }

  set street1(value: string) {
    this._street1 = value;
  }

  get street2(): string {
    return this._street2;
  }

  set street2(value: string) {
    this._street2 = value;
  }

  get street3(): string {
    return this._street3;
  }

  set street3(value: string) {
    this._street3 = value;
  }

  get region1(): string {
    return this._region1;
  }

  set region1(value: string) {
    this._region1 = value;
  }

  get region2(): string {
    return this._region2;
  }

  set region2(value: string) {
    this._region2 = value;
  }

  get postalcode(): string {
    return this._postalcode;
  }

  set postalcode(value: string) {
    this._postalcode = value;
  }

  get country(): string {
    return this._country;
  }

  set country(value: string) {
    this._country = value;
  }

  get validFrom(): string {
    return this._validFrom;
  }

  set validFrom(value: string) {
    this._validFrom = value;
  }

  get validTo(): string {
    return this._validTo;
  }

  set validTo(value: string) {
    this._validTo = value;
  }
}