export default class Email {
  private _order: number;
  private _usage: string;
  private _address: string;

  constructor(order?: number, usage?: string, address?: string) {
    this._order = order || -1;
    this._usage = usage || "";
    this._address = address || "";
  }

  toJson(): any {
    return {
      order: this.order,
      usage: this.usage,
      address: this.address
    }
  }

  fromJson(json: any): Email {
    this.order = json.order;
    this.usage = json.usage;
    this.address = json.address;
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

  get address(): string {
    return this._address;
  }

  set address(value: string) {
    this._address = value;
  }
}