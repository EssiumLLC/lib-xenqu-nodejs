import QueueItem from "./QueueItem";

export class Queue {
  private _forceOrdering: number;
  private _items: any[];
  private _primaryActorId: number;
  private _primaryActorRole: string;
  private _primaryActorRoleSlug: string;
  private _progressBinId: number;
  private _section: number;
  private _title: string;


  constructor(forceOrdering?: number, items?: any[], primaryActorId?: number, primaryActorRole?: string, primaryActorRoleSlug?: string, progressBinId?: null, section?: number, title?: string) {
    this._forceOrdering = forceOrdering || 0;
    this._items = items || [];
    this._primaryActorId = primaryActorId || -1;
    this._primaryActorRole = primaryActorRole || "Worker";
    this._primaryActorRoleSlug = primaryActorRoleSlug || "worker";
    this._progressBinId = progressBinId || -1;
    this._section = section || 1;
    this._title = title || "";
  }

  toJson(): any {
    return {
      title: this.title,
      primary_actor_role_slug: this.primaryActorRoleSlug,
      primary_actor_role: this.primaryActorRole,
      primary_actor_id: this.primaryActorId,
      section: this.section,
      force_ordering: this.forceOrdering,
      progress_bin_id: this.progressBinId,
      items: this.items,
    }
  }

  fromJson(json: any): Queue {
    this.title = json.title;
    this.primaryActorRoleSlug = json.primary_actor_role_slug;
    this.primaryActorRole = json.primary_actor_role;
    this.primaryActorId = json.primary_actor_id;
    this.section = json.section;
    this.forceOrdering = json.force_ordering;
    this.progressBinId = json.progress_bin_id;
    this.items = json.items;
    return this;
  }

  get forceOrdering(): number {
    return this._forceOrdering;
  }

  set forceOrdering(value: number) {
    this._forceOrdering = value;
  }

  get items(): any[] {
    return this._items;
  }

  set items(value: any[]) {
    this._items = value;
  }

  get primaryActorId(): number {
    return this._primaryActorId;
  }

  set primaryActorId(value: number) {
    this._primaryActorId = value;
  }

  get primaryActorRole(): string {
    return this._primaryActorRole;
  }

  set primaryActorRole(value: string) {
    this._primaryActorRole = value;
  }

  get primaryActorRoleSlug(): string {
    return this._primaryActorRoleSlug;
  }

  set primaryActorRoleSlug(value: string) {
    this._primaryActorRoleSlug = value;
  }

  get progressBinId(): number {
    return this._progressBinId;
  }

  set progressBinId(value: number) {
    this._progressBinId = value;
  }

  get section(): number {
    return this._section;
  }

  set section(value: number) {
    this._section = value;
  }

  get title(): string {
    return this._title;
  }

  set title(value: string) {
    this._title = value;
  }
}
