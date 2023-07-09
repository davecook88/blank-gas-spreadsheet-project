class BaserowClient {
  token: string;
  baseUrl: string;

  constructor({ token, baseUrl }: { token: string; baseUrl: string }) {
    this.token = token;
    this.baseUrl = baseUrl;
  }

  private _buildParameters(queryObject: {
    [key: string]: boolean | string | number | undefined;
  }): string {
    const queryArray: string[] = [];
    Object.entries(queryObject).forEach(([key, value]) => {
      if (key && value) {
        queryArray.push(`${encodeURI(key)}=${encodeURI(String(value))}`);
      }
    });
    return queryArray.length ? "?" + queryArray.join("&") : "";
  }

  private callApi(
    url: string,
    payload?: any,
    options?: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions
  ) {
    const headers = {
      Authorization: `Token ${this.token}`,
      "Content-Type": "application/json",
    };
    const defaultOptions = {
      method: "get",
      headers,
      muteHttpExceptions: true,
    };
    const requestOptions = Object.assign(defaultOptions, options);
    if (payload) {
      requestOptions.payload = JSON.stringify(payload);
    }
    const res = UrlFetchApp.fetch(url, requestOptions);
    const json = JSON.parse(res.getContentText());
    return json;
  }

  batchCreateRecords(tableId: number, payload: Array<any>) {
    const params = {
      user_field_names: true,
    };
    const url = `${
      this.baseUrl
    }/database/rows/table/${tableId}/batch/${this._buildParameters(params)}`;
    const options: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {
      method: "post",
    };
    return this.callApi(url, { items: payload }, options);
  }

  getTableFields(tableId: number) {
    const url = `${this.baseUrl}/database/fields/table/${tableId}`;
    return this.callApi(url) as BaserowField[];
  }

  listRecords<T>(
    tableId: number,
    params: Record<string, string | number | boolean>
  ) {
    // if page size is specified, only get 1st page
    let finished = false;
    let page = 1;
    const allResults: T[] = [];

    while (!finished) {
      const _params = {
        ...params,
        page,
      };
      const url = `${
        this.baseUrl
      }/database/rows/table/${tableId}${this._buildParameters(_params)}`;
      const response = this.callApi(url) as BaserowListRecordsResponse<T>;
      allResults.push(...response.results);
      if (params.size || !response.next) {
        finished = true;
      }

      page++;
    }
    return allResults;
  }

  updateRecords(tableId: number, payload: Array<any>) {
    const params = {
      user_field_names: true,
    };
    const url = `${
      this.baseUrl
    }/database/rows/table/${tableId}/batch/${this._buildParameters(params)}`;
    const options: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {
      method: "patch",
    };
    return this.callApi(url, { items: payload }, options);
  }
}
