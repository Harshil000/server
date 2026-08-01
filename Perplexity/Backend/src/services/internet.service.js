import { tavily } from "@tavily/core";

const tvly = tavily({ apiKey: process.env.TAVILY_API_KEY });

async function internetSearch(query) {
  try {
    const searchQuery = typeof query === "object" ? query.query : query;
    const response = await tvly.search(searchQuery, {
      searchDepth: "basic",
      maxResults: 5,
    });
    
    if (response && response.results) {
      return response.results
        .map((r) => `Title: ${r.title}\nURL: ${r.url}\nContent: ${r.content}`)
        .join("\n\n");
    }
    return JSON.stringify(response);
  } catch (error) {
    console.error("Tavily Internet Search Error:", error);
    return `Failed to fetch internet search results: ${error.message}`;
  }
}

export { internetSearch };