import 'dotenv/config';
import readline from 'readline/promises';
import { ChatGoogle } from "@langchain/google";
import { ChatMistralAI } from "@langchain/mistralai";
import { HumanMessage, tool, createAgent } from "langchain";
import { sendEmail } from './mail.service.js';
import * as z from "zod";

const emailTool = tool(
    sendEmail,
    {
        name: "emailTool",
        description: "Use This tool to send an email",
        schema: z.object({
            to: z.string().describe("Email address of the recipient"),
            html: z.string().describe("HTML content of the email"),
            subject: z.string().describe("Subject of the email"),
            text: z.string().describe("Plain text content of the email").optional(),
        })
    }
)

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// const model = new ChatGoogle("gemini-2.5-flash-lite");
const model = new ChatGoogle({
    model: "gemini-3.5-flash",
});

const agent = createAgent({
    model,
    tools: [emailTool]
})

let messages = []

const cyan = '\x1b[36m'
const green = '\x1b[32m'
const reset = '\x1b[0m'

while (true) {
    const prompt = await rl.question(`${cyan}You${reset} : `)

    messages.push(new HumanMessage(prompt))

    const response = await agent.invoke({ messages })

    console.log(`\n${green}AI${reset} : ${response.messages[response.messages.length - 1].content}\n`)

    messages.push(response.messages[response.messages.length - 1])
}

rl.close();