const TRIPETTO_SHEET_ID = "1aUJHaFDI5Frhn55uqlfpGkl613UeJ6ROumCOlBPAD5s";
const CONTENT_PLANNING_TAB_NAME = "Content Planning / Reporting";

function aggregateRankings(sheetId = TRIPETTO_SHEET_ID) {
  const ss = SpreadsheetApp.openById(sheetId);
  const sheet = new SpreadsheetManager(ss, CONTENT_PLANNING_TAB_NAME);

  const rows = sheet.getRowsAsObjects();

  const aggregator = new RankingAggregator(rows);

  aggregator.printResults();
}

interface RankingAggregator {
  rows: SpreadsheetManagerTypes.GenericRowObject[];

  // The key is the number of months after publishing
  // Rankings will be pushed into the array and from there, an average can be calculated
  rankingPerMonth: Map<number, number[]>;
}
class RankingAggregator {
  constructor(rows: SpreadsheetManagerTypes.GenericRowObject[]) {
    this.rows = rows.filter((r) => r["Date Published"]);
    this.rankingPerMonth = new Map();
    this.rows.forEach((r) => this.processRow(r));
  }

  private processRow(row: SpreadsheetManagerTypes.GenericRowObject) {
    const publishedDateTimestamp = (row["Date Published"] as Date).getTime();
    for (let key in row) {
      const d = new Date(key);
      const dateTime = d.getTime();
      // Only interested in keys which are a date (date that script ran)
      // Only check if dateTime is after published date
      if (!isNaN(dateTime) && dateTime > publishedDateTimestamp) {
        const timeDiff = dateTime - publishedDateTimestamp;
        // Let's say a month is 28 days
        const monthsDiff = Math.floor(timeDiff / (28 * 24 * 60 * 60 * 1000));
        const rankingVal = Number(row[key]);
        const ranking = isNaN(rankingVal) ? 100 : rankingVal;
        const rankingPerMonthArray = this.rankingPerMonth.get(monthsDiff) || [];
        rankingPerMonthArray.push(ranking);
        this.rankingPerMonth.set(monthsDiff, rankingPerMonthArray);
      }
    }
  }

  private getMonthAverageRank(monthIndex: number) {
    const arry = this.rankingPerMonth.get(monthIndex);
    if (!arry) return "N/A";

    const total = arry.reduce((acc, val) => acc + val, 0);
    return total / arry.length;
  }

  printResults() {
    const keys = Array.from(this.rankingPerMonth.keys());
    const min = Math.min(...keys);
    const max = Math.max(...keys);

    for (let i = min; i <= max; i++) {
      console.log(`Month ${i}\nAverage rank:${this.getMonthAverageRank(i)}`);
    }
  }
}
