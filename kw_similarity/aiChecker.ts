class AIChecker {
  systemPrompt = `You are an SEO assistant. 
  You will tell me if 2 search terms are semantically similar or not.
  Note that some keywords may be similar but the intent of the person searching will be different so these should be considered unique keywords.
  You respond with only a JSON object. The JSON object must be parsable by JSON.parse(). Do not add a comma after the last value. It must have the following structure:
  
  Example input:
  [
    ["where is the nearest pizza place","where is the closest pizza place"],
    ["how to make pizza","how to make bread"]
  ]
  Example output:
  {
    "where is the nearest pizza place": "similar",
    "how to make pizza": "unique"
  }
  `;

  openAi: OpenAIClient;

  constructor(private readonly apiKey: string) {
    this.openAi = new OpenAIClient(apiKey);
  }

  private getSimilarityChunk(kws: string[][]) {
    const messages: OpenAI.Message[] = [
      {
        role: "system",
        content: this.systemPrompt,
      },
      {
        role: "user",
        content: JSON.stringify(kws),
      },
    ];
    const payload: OpenAI.CompletionRequest = {
      model: "gpt-3.5-turbo",
      messages,
    };
    const response = this.openAi.getCompletion(payload);
    return response.choices?.[0].message.content;
  }

  getSimilarity(kws: string[][]) {
    // Split kws into chunks of 20 and pass each chunk to getSimilarityChunk
    // Concatenate the results and return
    const results = {};
    // regex to strip trailing commas
    const regex = /\,(?!\s*?[\{\[\"\'\w])/g;
    for (let i = 0; i < kws.length; i += 20) {
      const chunk = kws.slice(i, i + 20);
      const chunkResult = this.getSimilarityChunk(chunk);
      const cleanedChunkResult = chunkResult.replace(regex, "");
      try {
        const parsedChunkResult = JSON.parse(cleanedChunkResult);
        Object.assign(results, parsedChunkResult);
      } catch (e) {
        console.error(
          "error parsing chunk result",
          chunkResult,
          cleanedChunkResult
        );
      }
    }
    return results;
  }
}
