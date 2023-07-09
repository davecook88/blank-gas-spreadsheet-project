class NewKeyword {
  private readonly similarity: number;
  private readonly kw: string;
  private readonly client: string;
  private readonly closestMatch?: string;
  readonly alreadyTried: boolean;
  constructor({
    similarity,
    kw,
    client,
    closestMatch,
    alreadyTried = false,
  }: {
    similarity: number;
    kw: string;
    client: string;
    closestMatch?: string;
    alreadyTried?: boolean;
  }) {
    this.similarity = similarity;
    this.kw = kw;
    this.client = client;
    this.closestMatch = closestMatch;
    this.alreadyTried = alreadyTried || false;
  }

  createReturnValue() {
    return {
      kw: this.kw,
      similarity: this.similarity,
      closestMatch: this.closestMatch,
      alreadyTried: this.alreadyTried,
    };
  }

  createCreatePayload(): Partial<KwSimilarityBaserowFields> &
    Required<Pick<KwSimilarityBaserowFields, "client">> {
    return {
      keyword: this.kw,
      distance: String(this.similarity),
      most_similar: this.closestMatch,
      client: this.client,
    };
  }
}
