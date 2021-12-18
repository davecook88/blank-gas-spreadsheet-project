function getKeywordResearchSheet(props: {
  clientName?: string;
  fileId?: string;
}) {
  let ss: GoogleAppsScript.Spreadsheet.Spreadsheet;
  if (props.fileId) {
    ss = SpreadsheetApp.openById(props.fileId);
  } else {
    const fileName = props.clientName + " KW Research & Planning 🚀";
    const files = DriveApp.getFilesByName(fileName);
    if (!files.hasNext()) {
      throw new Error("Couldn't find a file by name: " + fileName);
    }
    const file = files.next();
    ss = SpreadsheetApp.openById(file.getId());
  }

  const sheet = new SpreadsheetManager(ss, "Keyword research");
  if (!sheet.sheet) {
    throw new Error("Couldn't find a tab called Keyword research");
  }

  return sheet;
}

function getKeywordAndUpdate(sheet: SpreadsheetManager, jobName: string) {
  let kw = sheet.forEachRow(
    (row: _Row) => {
      if (row.col("Specific post?") === jobName) {
        row.col("Approved for use?", "done");
        return row.col("Keyword");
      }
    },
    { bottomUp: true }
  );

  if (!kw) {
    kw = sheet.forEachRow(
      (row: _Row) => {
        const approvedForUse = row.col("Approved for use?");
        if (String(approvedForUse).toLowerCase() === "yes") {
          row.col("Approved for use?", "done");
          return row.col("Keyword");
        }
      },
      { bottomUp: true }
    );
  }
  sheet.updateAllValues();
  SpreadsheetApp.flush();
  return kw;
}

function test() {
  const sheet = getKeywordResearchSheet({
    clientName: "SG Web Partners",
    fileId: "1a_Ya7Wmj15pAE0iydRJkTTG1_pO4wCIKEF-TOcF6H50",
  });
  getKeywordAndUpdate(sheet, "1/4 March 2021");
}
