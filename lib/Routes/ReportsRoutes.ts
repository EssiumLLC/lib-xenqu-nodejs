import XenquBase from "../XenquBase";

export default class ReportsRoutes {

  /* Global Variables */
  private base: XenquBase;

  constructor() {
    this.base = new XenquBase('');
  }

  update(base: XenquBase) {
    this.base = base;
  }

  /**
   * Get Report Results
   * @see [API Docs]{@link https://apidocs.xenqu.com/#c5b6a594-36a3-4285-a60c-2580dd0e40a5}
   * @param jobId This ID can be found in the UI on the address bar
   * @param count Number of items to return. Defaults to 1
   * @param sortBy Field to sort by asc or dec. Defaults to "run_date:asc"
   * @param status Result Status. Defaults to 3 (completed)
   * @param offset Offset to access by. Results are always pagenated. Defaults to 0
   */
  public getReportResults(jobId: string, count: number = 1, sortBy: string = "run_date:asc", status: number = 3, offset: number = 0): Promise<any> {
    const params = {job_id: jobId, status: status, count: count, offset: offset, sortby: sortBy}
    return this.base.makeGet(`/reporting/results`, params);
  }

  /**
   * Get Report Result
   * @see [API Docs]{@link https://apidocs.xenqu.com/#94d68fc1-e80a-46e5-a4e9-dbef2c562d69}
   * @param reportId Report ID to get results of
   */
  public getReportResult(reportId: string): Promise<any[]> {
    return this.base.makeGet(`/reporting/results/${reportId}`);
  }

}
