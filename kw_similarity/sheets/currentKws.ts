class CurrentKwsSheet {
  private sheet: SpreadsheetManager;
  constructor() {
    const ss = SpreadsheetApp.openById(
      "1taEk3yFbbiPgiw-WkAj6yRZUzZhVzB_5xjlI_0gRosI"
    );
    this.sheet = new SpreadsheetManager(ss, "Own Current URL / Pos");
  }

  get rows() {
    return this.sheet.getRowsAsObjects() as {
      Keyword: string;
      Volume: number;
      Clicks: number;
      "Current URL": string;
      "Current position": number;
    }[];
  }

  get keywords() {
    return this.rows.map((row) => row.Keyword);
  }
}
