import XenquAPI from "../..";
import {Queue} from "../../Models/Queue";

export default class QueueRoutes {

  /**
   * Get the latest values for a queue including all its items.
   * @see [API Docs]{@link https://apidocs.xenqu.com/#bc053d06-4bbd-4c47-9c09-7db3454d16bd}
   * @param groupId Tab ID to get queue from
   * @param queueId Queue ID to get
   */
  getQueue(groupId: string, queueId: string) {
    return XenquAPI.Base.makeGet(`/tracking/groups/${groupId}/queues/${queueId}`)
  }

  /**
   * Create a queue
   * @see [API Docs]{@link https://apidocs.xenqu.com/#38e912b5-5c85-47f7-9800-299c5d66e773}
   * @param groupId Tab ID to create queue on
   * @param queue Queue to add
   */
  addQueue(groupId: string, queue: Queue) {
    return XenquAPI.Base.makePost(`/tracking/groups/${groupId}/queues`, JSON.stringify(queue.toJson()))
  }

  /**
   * Edit a queue
   * @see [API Docs]{@link https://apidocs.xenqu.com/#9c87cc46-1abb-4c76-a973-4ad3a8e5aec9}
   * @param groupId Tab ID to edit queue on
   * @param queueId Queue ID to edit
   * @param queue Queue to add
   */
  editQueue(groupId: string, queueId: string, queue: Queue) {
    return XenquAPI.Base.makePut(`/tracking/groups/${groupId}/queues/${queueId}`, JSON.stringify(queue.toJson()))
  }

  /**
   * Delete a queue
   * @see [API Docs]{@link https://apidocs.xenqu.com/#de5d65c9-0d96-4b7a-8436-f0a450b21e5f}
   * @param groupId Tab ID to delete queue on
   * @param queueId Queue ID to delete
   */
  deleteQueue(groupId: string, queueId: string) {
    return XenquAPI.Base.makeDelete(`/tracking/groups/${groupId}/queues/${queueId}`)
  }

}