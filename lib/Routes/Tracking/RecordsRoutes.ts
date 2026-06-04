import XenquAPI from "../..";

export default class RecordsRoutes {
    /**
     * Get a record and its content on a specific tab
     * @see [API Docs]{@link https://apidocs.xenqu.com/#3bd6f73c-b25e-4d3f-8695-5e58d35df88d}
     * @param groupId Tab ID to get record from
     * @param contactId Contact ID to get
     */
    getRecord(groupId: string, contactId: string) {
        return XenquAPI.Base.makeGet(
            `/tracking/groups/${groupId}/actors/${contactId}`
        );
    }

    /**
     * Get process rule state for a record on a tab (requires tab admin permissions on the impersonated user).
     */
    getProcessState(
        contactId: string,
        groupId: string,
        convertDates?: boolean
    ) {
        const params: Record<string, string> = {};
        if (convertDates) {
            params.convert_dates = "true";
        }
        return XenquAPI.Base.makeGet(
            `/tracking/contact/${contactId}/group/${groupId}/process_state`,
            params
        );
    }

    /**
     * Get automation history for a record: applied process rules, rule definitions,
     * related tracking items, and repeat usage percentages.
     * @see [API Docs]{@link https://apidocs.xenqu.com/}
     * @param groupId Tab ID
     * @param contactId Record primary actor (contact) ID
     */
    getAutomationHistory(groupId: string, contactId: string) {
        return XenquAPI.Base.makeGet(
            `/tracking/groups/${groupId}/actor/${contactId}/items/automation`
        );
    }

    /**
     * Get progress bin assignment history for a record on a tab.
     * Requires tab admin permissions on the impersonated user (queue/library/member/group admin).
     */
    getBinHistory(contactId: string, groupId: string) {
        return XenquAPI.Base.makeGet(
            `/tracking/contact/${contactId}/group/${groupId}/bin_history`
        );
    }

    /**
     * Initiates running automation rules on the record. This should be called after saving all queues or
     * editing any data that does not result in an item action (changing status, actors,etc)
     * @see [API Docs]{@link https://apidocs.xenqu.com/#f7b392bb-169b-4aca-b8d9-9cbafc471f9a}
     * @param groupId Tab ID to get record from
     * @param contactId Contact ID to run rules on
     */
    applyRules(groupId: string, contactId: string) {
        return XenquAPI.Base.makeGet(
            `/tracking/groups/${groupId}/actors/${contactId}/apply_rules`
        );
    }
}
