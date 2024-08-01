import XenquAPI from "../..";
import TrackingItem from "../../Models/TrackingItem";

export default class ItemsRoutes {

  /**
   * Get list of items for current user. This data is the same as seen under the "My Queue" menu in the UI. queued now complete
   * @see [API Docs]{@link https://apidocs.xenqu.com/#96bd981d-1505-4353-86f7-35f17d5a2f69}
   * @param queued Which list to return. "now" is everything the user must act upon. "complete" is everything they have previously acted upon.
   * @param sortCol Column to sort by. Allowed: relevance,create_date,last_log_date,schedule_date,priority,item_title
   * @param sortAscending Whether to sort ascending or not
   * @param offset Offset to access by. Results are always pagenated. Defaults to 0
   * @param count Number of items to return. Defaults to 20
   */
  getAssignedItemList(queued: "now"| "complete", sortCol: "relevance"|"create_date"|"last_log_date"|"schedule_date"|"priority"|"item_title", sortAscending: boolean = true, offset: number = 0, count: number = 20) {
    const sort = sortCol + ((!sortAscending)? ',desc' : '');
    return XenquAPI.Base.makeGet(`/tracking/user/items?queued=${queued}&sortby=${sort}&offset=${offset}&count=${count}`)
  }

  /**
   * Get more details about an item assigned to the current user. Includes the complete activity log on the item.
   * @see [API Docs]{@link https://apidocs.xenqu.com/#c909077e-1ac7-4501-9b0b-626d8bd75694}
   * @param trackingId Tracking ID to get details from
   */
  getAssignedItemDetail(trackingId: string) {
    return XenquAPI.Base.makeGet(`/tracking/user/items/${trackingId}`)
  }

  /**
   * Get detail about a tracking item on a record
   * @see [API Docs]{@link https://apidocs.xenqu.com/#9b97b262-1934-449f-9660-81770f6385f3}
   * @param trackingId Tracking Item ID to get
   * @param groupId Tab ID to get queue from
   * @param queueId Queue ID to get tracking item from
   */
  getTrackingItem(trackingId: string, groupId: string, queueId: string) {
    return XenquAPI.Base.makeGet(`/tracking/groups/${groupId}/queues/${queueId}/items/${trackingId}`)
  }

  /**
   * Update a tracking item on a record
   * @see [API Docs]{@link https://apidocs.xenqu.com/#16602514-0065-4db4-8327-1c15338579fb}
   * @param trackingId Tracking Item ID to update
   * @param groupId Tab ID to get queue from
   * @param queueId Queue ID to get tracking item from
   * @param trackingItem Updated Tracking Item
   * @param ignoreTimezones Ignore UTC Timezone offset when translating dates to YYYY-MM-DD. Defaults to false
   */
  updateTrackingItem(trackingId: string, groupId: string, queueId: string, trackingItem: TrackingItem, ignoreTimezones: boolean = false) {
    return XenquAPI.Base.makePut(`/tracking/groups/${groupId}/queues/${queueId}/items/${trackingId}`, JSON.stringify(trackingItem.toJson(false)))
  }

  /**
   * This will post a message on the item which is visible to all actors in their My Queue view,
   * on the dashboard, and, if subscribed, email/text to each assigned actor.
   * @see [API Docs]{@link https://apidocs.xenqu.com/#e3c14915-4491-4b37-a381-0af2d2ef10ce}
   * @param trackingId Tracking ID of item to post message to
   * @param message Message to post
   */
  addMessage(trackingId: string, message: string) {
    return XenquAPI.Base.makePost(`/tracking/items/${trackingId}/logs`, JSON.stringify({event_data:{message_text: message}}))
  }

  /**
   * Set a callback with a url to post back against when anything changes on the given item.
   * @see [API Docs]{@link https://apidocs.xenqu.com/#bda9a19c-f79f-466e-b47b-b230bda2b3e4}
   * @param trackingId Tracking Item ID to set callback on
   * @param groupId Tab ID to get queue from
   * @param queueId Queue ID to get tracking item from
   * @param url Callback URL to add
   */
  setCallback(trackingId: string, groupId: string, queueId: string, url: string) {
    return XenquAPI.Base.makePut(`/tracking/groups/${groupId}/queues/${queueId}/items/${trackingId}/callback`, JSON.stringify({callback_url: url}))
  }

  /**
   * Remove callback previously set on an item
   * @see [API Docs]{@link https://apidocs.xenqu.com/#2ce6d984-d018-464d-a024-a116f04d9e05}
   * @param trackingId Tracking Item ID remove callback from
   * @param groupId Tab ID to get queue from
   * @param queueId Queue ID to get tracking item from
   * @param url Callback URL to remove
   */
  removeCallback(trackingId: string, groupId: string, queueId: string, url: string) {
    return XenquAPI.Base.makeDelete(`/tracking/groups/${groupId}/queues/${queueId}/items/${trackingId}/callback`, JSON.stringify({callback_url: url}))
  }

  /**
   * By tab, get a list of items ordered by most recent activity to oldest
   * @see [API Docs]{@link https://apidocs.xenqu.com/#b0730376-afa6-4831-806d-5c54411e6ff7}
   * @param groupId Tab ID to get items from
   * @param count Number of items to return. Defaults to 5
   * @param offset Offset to access by. Results are always pagenated. Defaults to 0
   */
  getActivityStream(groupId: string, count: number = 5, offset: number = 0) {
    return XenquAPI.Base.makeGet(`/tracking/groups/${groupId}/items/activity?count=${count}&offset=${offset}`)
  }

  /**
   * For tracking items of type "attachment", list all the files associated with the item
   * @see [API Docs]{@link https://apidocs.xenqu.com/#cd32010b-15e7-4287-aa8d-4e81645eec3d}
   * @param trackingId Tracking ID to get attachments from
   */
  getAttachments(trackingId: string) {
    return XenquAPI.Base.makeGet(`/tracking/attachments/${trackingId}`)
  }

  /**
   * For tracking items of type "attachment", get file
   * @see [API Docs]{@link https://apidocs.xenqu.com/#cd32010b-15e7-4287-aa8d-4e81645eec3d}
   * @param attachmentId Attachment ID to get files from
   * @param fileId File ID to get
   */
  getDownload(attachmentId: string, fileId: string) {
    return XenquAPI.Base.makeGet(`/tracking/attachments/${attachmentId}/files/${fileId}`)
  }

  /**
   * For tracking items of type "attachment", add attachment to item
   * @see [API Docs]{@link https://apidocs.xenqu.com/#db3c24c6-a6d7-4f44-8eb3-9a82b70753e3}
   * @param attachmentId Attachment ID to add files to
   * @param data File Data from Files API
   */
  addAttachment(attachmentId: string, data: {filename: string, _temp_handle_id: string, tracking_id: number, content_type: string}) {
    return XenquAPI.Base.makePost(`/tracking/attachments/${attachmentId}/files`, JSON.stringify(data))
  }

  /**
   * For tracking items of type "attachment", update an attachment
   * @see [API Docs]{@link https://apidocs.xenqu.com/#0b52cc8c-40e4-40d6-8b95-266f7c8f139d}
   * @param attachmentId Attachment ID to update files of
   * @param data File Data from Files API
   */
  updateAttachment(attachmentId: string, data: {tracking_id: number, filename: string, _temp_handle_id: string}) {
    return XenquAPI.Base.makePut(`/tracking/attachments/${attachmentId}/files`, JSON.stringify(data))
  }

  /**
   * For tracking items of type "attachment", remove a file
   * @see [API Docs]{@link https://apidocs.xenqu.com/#2026a2a1-5455-4e60-a782-649b8101b7e2}
   * @param attachmentId Attachment ID
   * @param fileId File ID to remove
   */
  deleteAttachment(attachmentId: string, fileId: string) {
    return XenquAPI.Base.makeDelete(`/tracking/attachments/${attachmentId}/files/${fileId}`);
  }

  /**
   * Run Rules on an attachment item
   * @param itemId Item ID to run rules on
   * @param ruleRoute Rule Route to run. Ex: /run_rules/remove/<template_id> would be passed as ['remove', '<template_id>']
   */
  runRulesOnAttachment(itemId: string, ruleRoute: string[]) {
    return XenquAPI.Base.makeGet(`/tracking/attachments/${itemId}/run_rules/${ruleRoute.join('/')}`);
  }

}
