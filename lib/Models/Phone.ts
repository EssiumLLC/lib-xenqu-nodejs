export default class Phone {
  private _order: number;
  private _usage: string;
  private _format: string;
  private _number: string;

  constructor(order?: number, usage?: string, format?: string, number?: string) {
    this._order = order || -1;
    this._usage = usage || "";
    this._format = format || "";
    this._number = number || "";
  }

  toJson(): any {
    return {
      order: 0,
      usage: this.usage,
      format: this.format,
      number: ""
    }
  }

  fromJson(json: any): Phone {
    this.order = json.order;
    this.usage = json.usage;
    this.format = json.format;
    this.number = json.number;
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

  get format(): string {
    return this._format;
  }

  set format(value: string) {
    this._format = value;
  }

  get number(): string {
    return this._number;
  }

  set number(value: string) {
    this._number = value;
  }
}