export default class Actor {
  private _order: number;
  private _contactId: number;
  private _actorRole: string;
  private _actorRoleSlug: string;
  private _status: "queued" | "processing" | "complete";


  constructor(order?: number, contactId?: number, actorRole?: string, actorRoleSlug?: string, status?: "queued" | "processing" | "complete") {
    this._order = order || 1;
    this._contactId = contactId || -1;
    this._actorRole = actorRole || "";
    this._actorRoleSlug = actorRoleSlug || "" ;
    this._status = status || "queued";
  }

  toJson(): any {
    return {
      order: this.order,
      contact_id: this.contactId,
      actor_role: this.actorRole,
      actor_role_slug: this.actorRoleSlug,
      status: this.status
    }
  }

  fromJson(json: any): Actor {
    this._order = json.order;
    this._contactId = json.contact_id;
    this._actorRole = json.actor_role;
    this._actorRoleSlug = json.actor_role_slug;
    this._status = json.status;
    return this;
  }


  get order(): number {
    return this._order;
  }

  get contactId(): number {
    return this._contactId;
  }

  get actorRole(): string {
    return this._actorRole;
  }

  get actorRoleSlug(): string {
    return this._actorRoleSlug;
  }

  get status(): "queued" | "processing" | "complete" {
    return this._status;
  }

  set status(value: "queued" | "processing" | "complete") {
    this._status = value;
  }
}