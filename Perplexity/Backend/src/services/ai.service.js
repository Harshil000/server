import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatMistralAI } from "@langchain/mistralai";
import { HumanMessage, SystemMessage, AIMessage } from "@langchain/core/messages";
import { tool } from "@langchain/core/tools";
import { createAgent } from "langchain";
import { MemorySaver } from "@langchain/langgraph";
import { z } from "zod";
import { internetSearch } from "./internet.service.js";

const googleModel = process.env.GEMINI_API_KEY
  ? new ChatGoogleGenerativeAI({
      model: "gemini-2.5-flash-lite",
      apiKey: process.env.GEMINI_API_KEY,
      streaming: true,
    })
  : null;

const mistralModel = process.env.MISTRAL_API_KEY
  ? new ChatMistralAI({
      model: "mistral-small-latest",
      apiKey: process.env.MISTRAL_API_KEY,
      streaming: true,
    })
  : null;

const activeModel =  mistralModel;

// 1. Define Internet Search Tool using Tavily Search & Zod Schema
export const internetSearchTool = tool(
  async ({ query }) => {
    return await internetSearch(query);
  },
  {
    name: "internet_search",
    description:
      "Search the web for any information, including real-time current news, recent documentation, or historical data.",
    schema: z.object({
      query: z.string().describe("The search query string. Reflect user intent accurately (use current year for latest/current info, or specific past years if explicitly requested)."),
    }),
  }
);

// 2. LangChain Agent with MemorySaver Checkpointer
const agent = activeModel
  ? createAgent({
      model: activeModel,
      tools: [internetSearchTool],
      checkpointer: new MemorySaver(),
    })
  : null;

/**
 * Streams response and tool execution events token by token
 */
export async function GenerateResponseStream(previousChats = [], query, onToken, onToolCall, parsedFiles = []) {
  const currentYear = new Date().getFullYear();
  const hasAttachments = parsedFiles && parsedFiles.length > 0;
  const attachmentInstruction = hasAttachments
    ? "\n\nIMPORTANT: The user has attached file(s)/document(s) directly to this message. Answer and analyze using the attached document content. Do NOT search the internet unless the user explicitly requests an external web search."
    : "";

  const systemPrompt = new SystemMessage(
    `You are Perplexity AI, an intelligent web-connected assistant. The current year is ${currentYear}.${attachmentInstruction}
When using the internet_search tool:
- If the user asks for "latest", "current", "now", "today", or recent topics, construct search queries using the current time context (${currentYear}).
- If the user explicitly asks for historical data or a specific past year (e.g. 2020, 2018), search for that specific requested year.`
  );

  // Extract text attachments (PDFs, text, code) and image attachments
  const textAttachments = parsedFiles
    .filter((f) => f.type === "text")
    .map((f) => f.text)
    .join("\n\n");

  const imageAttachments = parsedFiles
    .filter((f) => f.type === "image")
    .map((f) => f.payload);

  let userContent;

  if (imageAttachments.length > 0) {
    let textPrompt = query || "";
    if (textAttachments) {
      textPrompt = `${textAttachments}\n\n${textPrompt}`;
    }
    userContent = [
      { type: "text", text: textPrompt || "Please analyze the attached image(s)." },
      ...imageAttachments,
    ];
  } else {
    userContent = textAttachments
      ? `${textAttachments}\n\nUser Query: ${query}`
      : query;
  }

  const formattedMessages = [
    systemPrompt,
    ...previousChats.map((chat) => {
      if (chat.role === "user") {
        return new HumanMessage(chat.content);
      } else {
        return new AIMessage(chat.content);
      }
    }),
    new HumanMessage({ content: userContent }),
  ];

  const config = { configurable: { thread_id: "thread_" + Date.now() } };
  let fullResponse = "";

  if (agent) {
    try {
      const eventStream = agent.streamEvents(
        { messages: formattedMessages },
        { ...config, version: "v2" }
      );

      for await (const event of eventStream) {
        const eventType = event.event;

        if (eventType === "on_chat_model_stream") {
          const token = event.data?.chunk?.text || event.data?.chunk?.content || "";
          if (token) {
            fullResponse += token;
            if (onToken) onToken(token);
          }
        } else if (eventType === "on_tool_start") {
          console.log(`\n[Agent Tool Start]: ${event.name}`, event.data?.input);
          if (onToolCall) {
            onToolCall({ name: event.name, input: event.data?.input });
          }
        } else if (eventType === "on_tool_end") {
          console.log(`[Agent Tool End]: ${event.name}`);
        }
      }
      return fullResponse;
    } catch (err) {
      console.error("Agent streamEvents error, falling back to direct model stream:", err);
    }
  }

  // Fallback direct model stream if agent is uninitialized
  if (activeModel) {
    const stream = await activeModel.stream(formattedMessages);
    for await (const chunk of stream) {
      const token = chunk.text || chunk.content || "";
      if (token) {
        fullResponse += token;
        if (onToken) onToken(token);
      }
    }
  }

  return fullResponse;
}

export async function GenerateResponse(previousChats, query) {
  let result = "";
  await GenerateResponseStream(previousChats, query, (token) => {
    result += token;
  });
  return result;
}

export async function GenerateChatTitle(query) {
  if (!activeModel) return "New Conversation";
  const response = await activeModel.invoke([
    new SystemMessage(
      `You are a helpful assistant that generates concise titles for chat conversations in 2-4 words.`
    ),
    new HumanMessage(`Generate a short title for this initial query: ${query}`),
  ]);
  return response.text || "New Conversation";
}