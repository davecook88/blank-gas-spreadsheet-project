class OpenAIClient {
  baseUrl: string = "https://api.openai.com/v1";

  constructor(private readonly apiKey: string) {}

  private callApi(endpoint: string, payload: object) {
    const url = `${this.baseUrl}/${endpoint}`;
    const headers = {
      Authorization: `Bearer ${this.apiKey}`,
    };
    const options: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {
      method: "post",
      contentType: "application/json",
      headers,
      payload: JSON.stringify(payload),
    };
    const response = UrlFetchApp.fetch(url, options);
    return JSON.parse(response.getContentText());
  }

  getCompletion(payload: OpenAI.CompletionRequest) {
    const endpoint = "chat/completions";
    return this.callApi(endpoint, payload);
  }
}
