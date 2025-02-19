import XenquAPI from "..";
import { HelpCenterAction, HelpCenterLlmResponse, HelpCenterPage, HelpCenterSearchResults, HelpCenterSpaces } from "../Models/HelpCenter";

export default class HelpCenterRoutes {

  /**
   * Get all the avaliable spaces
   * @param location location to fetch articles of
   */
  public getSpaces(location: 'dashboard'): Promise<HelpCenterSpaces> {
    return XenquAPI.Base.makeGet(`/help_center/spaces?location_help=${location}`);
  }

  /**
   * Get page
   * @param pageId page ID to fetch
   */
  public getPage(pageId: string): Promise<HelpCenterPage> {
    return XenquAPI.Base.makeGet(`/help_center/pages/${pageId}`);
  }

  /**
   * Log action
   * @param action action to log
   * @param result result of the action
   */
  public logAction(action: HelpCenterAction, result?: any): Promise<{ ok: boolean }> {
    return XenquAPI.Base.makePost(`/help_center/action/${action}`, result ? JSON.stringify(result) : undefined);
  }

  /**
   * Search articles
   */
  public search(query: string, options?: { offset?: number, limit?: number }): Promise<HelpCenterSearchResults> {
    const limit = options && options.limit ? `&limit=${options.limit}` : '';
    const offset = options && options.offset ? `&offset=${options.offset}` : '';
    return XenquAPI.Base.makeGet(`/help_center/search?search_term=${query}${limit}${offset}`);
  }

  /**
   * Run the search term through the LLM
   */
  public search_llm(query: string): Promise<HelpCenterLlmResponse> {
    return XenquAPI.Base.makeGet(`/help_center/search_llm?search_term=${query}`);
  }

  /**
   * Rate the LLM response
   * @param id LLM response ID
   * @param feedback 0 for negative, 1 for positive
   */
  public feedback_search_llm(id: string, feedback: 0 | 1): Promise<{ok: boolean}> {
    return XenquAPI.Base.makePost('/help_center/llm_feedback', JSON.stringify({id, feedback}));
  }

}