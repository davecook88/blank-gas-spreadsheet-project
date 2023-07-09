let memoizedRecords: any[] = [];
let newRecordsCreated = true;
let latestDateString = "";
let existingKeywordsSet: Set<string> = new Set();

function kwSimilarityBaserow(client: string, kws: string[]) {
  console.log("kwSimilarityBaserow");
  const SIMILARITY_THRESHOLD = 0.95;
  const lowercaseKws = Array.from(new Set(kws.map((kw) => kw.toLowerCase())));
  const baserow = new BaserowClient({
    token: config.baserow.token,
    baseUrl: config.baserow.baseUrl,
  });

  console.time("listRecords");
  const newRecords = newRecordsCreated ? getMoreRecords(baserow, client) : [];
  console.log("newRecords", newRecords.length);
  newRecords.forEach((record) => {
    existingKeywordsSet.add(record.keyword?.toLowerCase() || "");
  });
  const records = [...memoizedRecords, ...newRecords];
  memoizedRecords = records;
  console.timeEnd("listRecords");

  const existingKWs = records.map((r) => new ExistingKeyword(r));

  console.time("newKws");
  const newKws = lowercaseKws.map((kw) => {
    if (existingKeywordsSet.has(kw))
      return new NewKeyword({ kw, client, alreadyTried: true, similarity: 1 });
    const match = existingKWs.find((existingKW) => {
      const result = existingKW.compare(kw);
      if (result.similarity > SIMILARITY_THRESHOLD) {
        return result;
      }
    });

    return new NewKeyword({
      kw,
      client,
      closestMatch: match?.kw,
      similarity: match?.similarity || 0,
    });
  });
  console.timeEnd("newKws");
  console.time("batchUpdateRecords");
  batchUpdateRecords(
    baserow,
    existingKWs.filter((kw) => kw.updated).map((kw) => kw.createUpdatePayload())
  );
  console.timeEnd("batchUpdateRecords");
  console.time("batchCreateRecords");
  const filteredNewKws = newKws.filter((kw) => !kw.alreadyTried);
  if (filteredNewKws.length) newRecordsCreated = true;
  else {
    newRecordsCreated = false;
    return newKws.map((kw) => kw.createReturnValue());
  }

  batchCreateRecords(
    baserow,
    filteredNewKws.map((kw) => kw?.createCreatePayload())
  );
  console.timeEnd("batchCreateRecords");
  latestDateString = new Date().toISOString();
  return newKws.map((kw) => kw.createReturnValue());
}

function getMoreRecords(baserow: BaserowClient, client: string) {
  const params = {
    user_field_names: true,
    filter__field_462__equal: client,
    filter__field_463__date_after: latestDateString,
  };
  const records = baserow.listRecords<KwSimilarityBaserowFields>(
    config.baserow.tables.kw_similarity.id,
    params
  );
  return records;
}

function batchCreateRecords(baserow: BaserowClient, payloads: any[]) {
  const batches: any[] = batch(payloads);
  batches.forEach((batch) => {
    const res = baserow.batchCreateRecords(
      config.baserow.tables.kw_similarity.id,
      batch
    );
    console.log("batch create response", res);
  });
}

function batchUpdateRecords(baserow: BaserowClient, payloads: any[]) {
  const batches: any[] = batch(payloads);
  batches.forEach((batch) => {
    const res = baserow.updateRecords(
      config.baserow.tables.kw_similarity.id,
      batch
    );
    console.log("batch update response", res);
  });
}

function batch(records: any[], batchSize: number = 10) {
  const batches: any[] = [];
  for (let i = 0; i < records.length; i += batchSize) {
    batches.push(records.slice(i, i + batchSize));
  }
  return batches;
}

function testKwSimilarityBaserow() {
  const alreadyProposedSheet = new CurrentKwsSheet();
  batch(alreadyProposedSheet.keywords, 100).forEach((batch) => {
    kwSimilarityBaserow("https://wpstream.net/", batch);
  });
}
