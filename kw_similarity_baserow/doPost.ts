type CheckKwSimilarityPayload = {
  client: string;
  keywords: string[];
};

function doPost(e: GoogleAppsScript.Events.DoPost) {
  const MAX_KWS = 100;
  // get json payload
  const payload = JSON.parse(e.postData.contents);
  if (!payload) {
    return ContentService.createTextOutput("No payload");
  }
  if (!payload.client) {
    return ContentService.createTextOutput("No client");
  }
  if (!payload.keywords) {
    return ContentService.createTextOutput("No keywords");
  }
  if (payload.keywords.length > MAX_KWS) {
    return ContentService.createTextOutput(
      `Too many keywords. Max is ${MAX_KWS}`
    );
  }
  const response = kwSimilarityBaserow(payload.client, payload.keywords);
  return ContentService.createTextOutput(JSON.stringify(response)).setMimeType(
    (MimeType as any).JSON
  );
}
