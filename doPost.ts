interface Params {
  fileId?: string;
  clientName?: string;
  jobName: string;
}

function doPost(e: GoogleAppsScript.Events.DoPost) {
  let result: any = {};
  const params = e.parameter as Params;
  try {
    const sheet = getKeywordResearchSheet(params);
    const kw = getKeywordAndUpdate(sheet, params.jobName);
    result = {
      sheetId: sheet.sheet?.getSheetId(),
      fileId: sheet.wb.getId(),
      keyword: kw || "keyword to do",
    };
  } catch (err) {
    result.err = err;
  } finally {
    return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(
      ContentService.MimeType.JSON
    );
  }
}
