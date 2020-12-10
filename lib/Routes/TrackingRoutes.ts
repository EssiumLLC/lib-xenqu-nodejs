import XenquBase from "../XenquBase";
import ItemsRoutes from "./Tracking/ItemsRoutes";
import QueueRoutes from "./Tracking/QueueRoutes";
import RecordsRoutes from "./Tracking/RecordsRoutes";
import TabsRoutes from "./Tracking/TabsRoutes";

export default class TrackingRoutes {

  /* Global Variables */
  private _items: ItemsRoutes = new ItemsRoutes();
  private _queue: QueueRoutes = new QueueRoutes();
  private _records: RecordsRoutes = new RecordsRoutes();
  private _tabs: TabsRoutes = new TabsRoutes();

  update(base: XenquBase) {
    this.items.update(base);
    this.queue.update(base);
    this.records.update(base);
    this.tabs.update(base);
  }

  get items(): ItemsRoutes {
    return this._items;
  }

  get queue(): QueueRoutes {
    return this._queue;
  }

  get records(): RecordsRoutes {
    return this._records;
  }

  get tabs(): TabsRoutes {
    return this._tabs;
  }
}