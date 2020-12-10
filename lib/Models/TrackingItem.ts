import Actor from "./Actor";
import Address from "./Address";

export default class TrackingItem {
  private _status: "open"| "closed" | "skip";
  private _scheduleDate: Date;
  private _priority: 1 | 2 | 3;
  private _extraLabel: string;
  private _actors: Actor[];

  constructor(status?: "open"| "closed" | "skip", scheduleDate?: Date, priority?: 1 | 2 | 3, extraLabel?: string) {
    this._status = status || "open";
    this._scheduleDate = scheduleDate || new Date;
    this._priority = priority || 1;
    this._extraLabel = extraLabel || "";
    this._actors = []
  }

  toJson(ignoreTimeZone: boolean = false): any {
    if(!ignoreTimeZone){
      const offset = this.scheduleDate.getTimezoneOffset()
      this.scheduleDate = new Date(this.scheduleDate.getTime() - (offset*60*1000))
    }
    const finalScheduleDate = this.scheduleDate.toISOString().split('T')[0]
    return {
      status: this.status,
      schedule_date: finalScheduleDate,
      priority: this.priority,
      extra_label: this.extraLabel,
      item: {
        actors: this.actors.map((actor, index) => {return actor.toJson()})
      }
    }
  }

  fromJson(json: any): TrackingItem {
    this.status = json.status;
    this.scheduleDate = new Date(json.schedule_date);
    this.priority = json.priority;
    this.extraLabel = json.extra_label
    this.actors = json.item.actors.map((actor: any) => {const a = new Actor(); return a.fromJson(actor)});
    return this;
  }

  get status(): "open" | "closed" | "skip" {
    return this._status;
  }

  set status(value: "open" | "closed" | "skip") {
    this._status = value;
  }

  get scheduleDate(): Date {
    return this._scheduleDate;
  }

  set scheduleDate(value: Date) {
    this._scheduleDate = value;
  }

  get priority(): 1 | 2 | 3 {
    return this._priority;
  }

  set priority(value: 1 | 2 | 3) {
    this._priority = value;
  }

  get extraLabel(): string {
    return this._extraLabel;
  }

  set extraLabel(value: string) {
    this._extraLabel = value;
  }

  get actors(): Actor[] {
    return this._actors;
  }

  set actors(value: Actor[]) {
    this._actors = value;
  }
}