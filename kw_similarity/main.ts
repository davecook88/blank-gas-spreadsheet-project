function main() {
  const alreadyProposedSheet = new AlreadyProposedSheet();
  const currentKws = new CurrentKwsSheet();

  const alreadyProposedKws = alreadyProposedSheet.keywords;
  getClosestMatches(currentKws.keywords, alreadyProposedKws);
}

function getClosestMatches(currentKws: string[], alreadyProposedKws: string[]) {
  const matchesSheet = new SpreadsheetManager(
    SpreadsheetApp.getActiveSpreadsheet(),
    "matches"
  );
  matchesSheet.clearSheet();
  const matches: Record<
    string,
    {
      similarity: number | null;
      kw: string;
      closest_match: string;
    }[]
  > = currentKws.reduce(
    (acc, kw) => {
      acc[kw] = alreadyProposedKws.map((alreadyProposedKw) => {
        const similarity = jaroWinklerDistance(kw, alreadyProposedKw);
        return {
          similarity,
          kw,
          closest_match: alreadyProposedKw,
        };
      });
      return acc;
    },
    {} as Record<
      string,
      {
        similarity: number | null;
        kw: string;
        closest_match: string;
      }[]
    >
  );

  const aiChecker = new AIChecker(
    "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"
  );

  const newRows: {
    kw: string;
    closest_match: string;
    similarity: number;
    unique: string;
  }[] = Object.entries(matches).map(([kw, matches]) => {
    const sortedMatches = matches.sort((a, b) => {
      if (a.similarity === null) return 1;
      if (b.similarity === null) return -1;
      return b.similarity - a.similarity;
    });
    const bestMatch = sortedMatches[0];

    const newRow = {
      kw,
      closest_match: bestMatch.closest_match,
      similarity: bestMatch.similarity ?? 0,
      unique: "",
    };
    if (newRow.similarity < 0.9) {
      newRow.unique = "unique";
    } else if (newRow.similarity >= 0.96) {
      newRow.unique = "similar";
    } else {
      // console.log("checking with AI", JSON.stringify(newRow));
      // const similarity = aiChecker.getSimilarity(kw, bestMatch.closest_match);
      // console.log("similarity", similarity);
      // newRow.unique = similarity;
    }
    return newRow;
  });

  const payloadForAiChecker = newRows
    .filter((r) => !r.unique)
    .map((r) => [r.kw, r.closest_match]);

  const aiCheckerResults: Record<string, string> =
    aiChecker.getSimilarity(payloadForAiChecker);
  newRows.forEach((r) => {
    if (!r.unique) {
      r.unique = aiCheckerResults[r.kw];
    }
  });

  matchesSheet.addNewRowsFromObjects(newRows);
}
