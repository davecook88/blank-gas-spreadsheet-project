const TRIPETTO_SHEET_ID = "1aUJHaFDI5Frhn55uqlfpGkl613UeJ6ROumCOlBPAD5s";
const CONTENT_PLANNING_TAB_NAME = "Content Planning / Reporting";

function aggregateRankings(sheetId = TRIPETTO_SHEET_ID) {
  const ss = SpreadsheetApp.openById(sheetId);
  const sheet = new SpreadsheetManager(ss, CONTENT_PLANNING_TAB_NAME);

  const rows = sheet.getRowsAsObjects();

  console.log(JSON.stringify(rows));
}
