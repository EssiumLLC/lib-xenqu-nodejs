import Email from "./Email";
import Phone from "./Phone";
import Address from "./Address";

export default class Contact {
  private _locale: string;
  private _displayName: string;
  private _orgName: string;
  private _title: string;
  private _salutation: string;
  private _firstName: string;
  private _middleName: string;
  private _lastName: string;
  private _nameSuffix: string;
  private _nickName: string;
  private _notes: string;
  private _emails: Email[];
  private _phones: Phone[];
  private _addresses: Address[];
  private _tags: string[];


  constructor() {
    this._locale = "";
    this._displayName = "";
    this._orgName = "";
    this._title = "";
    this._salutation = "";
    this._firstName = "";
    this._middleName = "";
    this._lastName = "";
    this._nameSuffix = "";
    this._nickName = "";
    this._notes = "";
    this._emails = [];
    this._phones = [];
    this._addresses = [];
    this._tags = [];
  }

  toJson(): any {
    return  {
      locale: this.locale,
      display_name: this.displayName,
      org_name: this.orgName,
      title: this.title,
      salutation: this.salutation,
      first_name: this.firstName,
      middle_name: this.middleName,
      last_name: this.lastName,
      name_suffix: this.nameSuffix,
      nick_name: this.nickName,
      notes: this.notes,
      emails: this.emails.map((email, index) => {email.order = index; return email.toJson()}),
      phones: this.phones.map((phone, index) => {phone.order = index; return phone.toJson()}),
      addresses: this.addresses.map((address, index) => {address.order = index; return address.toJson()}),
      tags: this.tags
    }
  }

  fromJson(json: any): Contact {
    this.locale = json.locale;
    this.displayName = json.displayName;
    this.orgName = json.orgName;
    this.title = json.title;
    this.salutation = json.salutation;
    this.firstName = json.firstName;
    this.middleName = json.middleName;
    this.lastName = json.lastName;
    this.nameSuffix = json.nameSuffix;
    this.nickName = json.nickName;
    this.notes = json.notes;
    this.emails = json.emails.map((email: any) => {const e = new Email(); return e.fromJson(email)});
    this.phones = json.phones.map((phone: any) => {const p = new Phone(); return p.fromJson(phone)});
    this.addresses = json.addresses.map((address: any) => {const a = new Address(); return a.fromJson(address)});
    this.tags = json.tags;
    return this;
  }

  get locale(): string {
    return this._locale;
  }

  set locale(value: string) {
    this._locale = value;
  }

  get displayName(): string {
    return this._displayName;
  }

  set displayName(value: string) {
    this._displayName = value;
  }

  get orgName(): string {
    return this._orgName;
  }

  set orgName(value: string) {
    this._orgName = value;
  }

  get title(): string {
    return this._title;
  }

  set title(value: string) {
    this._title = value;
  }

  get salutation(): string {
    return this._salutation;
  }

  set salutation(value: string) {
    this._salutation = value;
  }

  get firstName(): string {
    return this._firstName;
  }

  set firstName(value: string) {
    this._firstName = value;
  }

  get middleName(): string {
    return this._middleName;
  }

  set middleName(value: string) {
    this._middleName = value;
  }

  get lastName(): string {
    return this._lastName;
  }

  set lastName(value: string) {
    this._lastName = value;
  }

  get nameSuffix(): string {
    return this._nameSuffix;
  }

  set nameSuffix(value: string) {
    this._nameSuffix = value;
  }

  get nickName(): string {
    return this._nickName;
  }

  set nickName(value: string) {
    this._nickName = value;
  }

  get notes(): string {
    return this._notes;
  }

  set notes(value: string) {
    this._notes = value;
  }

  get emails(): Email[] {
    return this._emails;
  }

  set emails(value: Email[]) {
    this._emails = value;
  }

  get phones(): Phone[] {
    return this._phones;
  }

  set phones(value: Phone[]) {
    this._phones = value;
  }

  get addresses(): Address[] {
    return this._addresses;
  }

  set addresses(value: Address[]) {
    this._addresses = value;
  }

  get tags(): string[] {
    return this._tags;
  }

  set tags(value: string[]) {
    this._tags = value;
  }
}