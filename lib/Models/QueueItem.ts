import Actor from "./Actor";

export default class QueueItem{
  private _actors: Actor[] ;
  private _itemId: number;
  private _order: number;
  private _trackingId: number;
  private _trackingLibraryId: number;

  constructor(actors?: Actor[], itemId?: number, order?: number, trackingLibraryId?: number) {
    this._actors = actors || []
    this._itemId = itemId || -1;
    this._order = order || -1;
    this._trackingId = Math.ceil(Math.random() * 1000);
    this._trackingLibraryId = trackingLibraryId || -1;
  }

  toJson(): any {
    return {
      order: this.order,
      tracking_id: this.trackingId,
      item_id: this.itemId,
      tracking_library_id: this.trackingLibraryId,
      item: {
        actors: this.actors.map((actor) => actor.toJson())
      }
    }
  }

  fromJson(json: any): QueueItem {
    this.order = json.order;
    this.trackingId = json.tracking_id;
    this.itemId = json.item_id;
    this.trackingLibraryId = json.tracking_library_id;
    this.actors = json.item.actors.map((actor: any) => new Actor().fromJson(actor));
    return this;
  }

  get actors(): Actor[] {
    return this._actors;
  }

  set actors(value: Actor[]) {
    this._actors = value;
  }

  get itemId(): number {
    return this._itemId;
  }

  set itemId(value: number) {
    this._itemId = value;
  }

  get order(): number {
    return this._order;
  }

  set order(value: number) {
    this._order = value;
  }

  get trackingId(): number {
    return this._trackingId;
  }

  set trackingId(value: number) {
    this._trackingId = value;
  }

  get trackingLibraryId(): number {
    return this._trackingLibraryId;
  }

  set trackingLibraryId(value: number) {
    this._trackingLibraryId = value;
  }
}