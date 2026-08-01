import { GenerateResponse, GenerateResponseStream, GenerateChatTitle } from "../services/ai.service.js"
import {
    getChatMessagesByChatId,
    createNewChat,
    getChatById,
    createNewMessageByChatId,
    getAllChats as getAllChatsFromRepository,
    deleteChatByChatId
} from '../repository/chat.repository.js'

import { parseUploadedFile } from "../utils/fileParser.util.js";

export async function sendMessage(req, res, next) {
    try {
        const { message, chatID } = req.body;
        const user = req.user;
        const files = req.files || [];
        let previousChats = [];
        let chat;

        // Parse uploaded files in memory
        const parsedFiles = [];
        for (const file of files) {
            const parsed = await parseUploadedFile(file);
            parsedFiles.push(parsed);
        }

        if (chatID) {
            chat = await getChatById(chatID, user.userId);
            if (!chat) {
                return res.status(404).json({
                    success: false,
                    message: "Chat not found"
                });
            }
            previousChats = await getChatMessagesByChatId(chatID, user.userId);
        } else {
            const titlePrompt = message || (files.length > 0 ? `Analysis of ${files[0].originalname}` : "New Chat");
            const title = await GenerateChatTitle(titlePrompt);
            chat = await createNewChat(title, user.userId);
        }

        const isSSE = req.headers.accept?.includes("text/event-stream") || req.query.stream === "true" || req.body.stream === true;

        if (isSSE) {
            res.setHeader("Content-Type", "text/event-stream");
            res.setHeader("Cache-Control", "no-cache");
            res.setHeader("Connection", "keep-alive");

            res.write(`data: ${JSON.stringify({ type: "init", title: chat.title, chatID: chat.chat_id })}\n\n`);

            const fullResponse = await GenerateResponseStream(
                previousChats,
                message,
                (token) => {
                    res.write(`data: ${JSON.stringify({ type: "token", token })}\n\n`);
                },
                (toolCall) => {
                    res.write(`data: ${JSON.stringify({ type: "tool", toolCall })}\n\n`);
                },
                parsedFiles
            );

            await createNewMessageByChatId(chat.chat_id, message, "user");
            await createNewMessageByChatId(chat.chat_id, fullResponse, "AI");

            res.write(`data: ${JSON.stringify({ type: "done", title: chat.title, chatID: chat.chat_id, response: fullResponse })}\n\n`);
            res.end();
            return;
        }

        const response = await GenerateResponse(previousChats, message);
        await createNewMessageByChatId(chat.chat_id, message, "user");
        await createNewMessageByChatId(chat.chat_id, response, "AI");

        res.status(200).json({
            success: true,
            message,
            title: chat.title,
            response,
            chatID: chat.chat_id,
        });
    } catch (error) {
        next(error);
    }
}

export async function getAllChats(req, res, next) {
    try {
        const user = req.user;
        const chats = await getAllChatsFromRepository(user.userId);
        res.status(200).json({
            success: true,
            chats
        })
    } catch (error) {
        next(error);
    }
}

export async function getAllMessagesOfChat(req, res, next) {
    try {
        const user = req.user;
        const { chatID } = req.params;

        const chat = await getChatById(chatID, user.userId);
        if (!chat) {
            return res.status(404).json({
                success: false,
                message: "Chat not found"
            });
        }

        const messages = await getChatMessagesByChatId(chatID, user.userId);

        if (!messages.length) {
            return res.status(404).json({
                success: false,
                message: "No messages found"
            });
        }

        res.status(200).json({
            success: true,
            chat,
            messages
        })
    }
    catch (error) {
        next(error);
    }
}

export async function deleteChat(req , res , next){
    try {
        const user = req.user;
        const { chatID } = req.params;

        const chat = await getChatById(chatID, user.userId);
        if (!chat) {
            return res.status(404).json({
                success: false,
                message: "Chat not found"
            });
        }

        const deletedChat = await deleteChatByChatId(chatID, user.userId);
        if (!deletedChat) {
            return res.status(404).json({
                success: false,
                message: "Chat not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Chat deleted successfully"
        })
    } catch (error) {
        next(error);
    }
}