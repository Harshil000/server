import { HumanMessage } from "@langchain/core/messages";
import { StateSchema, MessagesValue, ReducedValue, StateGraph, START, END } from "@langchain/langgraph";
import { mistralModel, cohereModel, geminiModel } from "../services/model.service.js"
import { createAgent, providerStrategy } from "langchain";
import { z } from 'zod'

const State = new StateSchema({
    messages: MessagesValue,
    solution_1: new ReducedValue(z.string().default(""), {
        reducer: (current, next) => {
            return next
        }
    }),
    solution_2: new ReducedValue(z.string().default(""), {
        reducer: (current, next) => {
            return next
        }
    }),
    judge_recommendation: new ReducedValue(z.object({
        solution_1: z.number().default(0),
        solution_2: z.number().default(0),
    }).default({
        solution_1: 0,
        solution_2: 0,
    }), {
        reducer: (current, next) => {
            return next
        }
    })
})


const solutionNode = async (state: typeof State.State) => {

    const userQuery = state.messages[0]?.text ?? "";

    const [mistral_solution, cohere_solution] = await Promise.all([
        mistralModel.invoke(userQuery),
        cohereModel.invoke(userQuery),
    ])

    return {
        solution_1: mistral_solution.text,
        solution_2: cohere_solution.text,
    }
}

const judgeNode = async (state: typeof State.State) => {

    const { solution_1, solution_2 } = state

    const judge = createAgent({
        model: geminiModel,
        tools: [],
        responseFormat: providerStrategy(z.object({
            solution_1: z.number().min(0).max(10),
            solution_2: z.number().min(0).max(10)
        }))
    })

    const judgeResponse = await judge.invoke({
        messages: [new HumanMessage(
            `You are judge tasked with evaluating the quality of two solutions to a problem.

            The problem is ${state.messages[0]?.text ?? ""}

            solution_1 = ${solution_1}
            solution_2 = ${solution_2}

            Give the rating out of 10 to both of them.
            0 means solution is incorrect or irrelevant,
            and 10 means the solution is perfect and fully addresses the problem.
            `
        )]
    })

    const result = judgeResponse.structuredResponse

    return {
        judge_recommendation: result
    }
}

const graph = new StateGraph(State)
    .addNode("solution", solutionNode)
    .addNode("judge", judgeNode)
    .addEdge(START, "solution")
    .addEdge("solution", "judge")
    .addEdge("judge", END)
    .compile();

export default async function(userMessage : string){
    const res = await graph.invoke({
        messages : [
            new HumanMessage(userMessage)
        ]
    })

    console.log(res)

    return res;
}