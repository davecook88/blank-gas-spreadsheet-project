class AlreadyProposedSheet {
  private sheet: SpreadsheetManager;
  constructor() {
    const ss = SpreadsheetApp.openById(
      "1taEk3yFbbiPgiw-WkAj6yRZUzZhVzB_5xjlI_0gRosI"
    );
    this.sheet = new SpreadsheetManager(ss, "Already Proposed?");
  }

  get rows() {
    return this.sheet.getRowsAsObjects() as {
      Keyword: string;
      Status: string;
      "Long tail kws": string;
    }[];
  }

  get keywords() {
    return this.rows.map((row) => row.Keyword);
  }
}
