import { pool } from '../config/database.js'
import {
    GET_CHAT_BY_CHAT_ID,
    GET_CHAT_MESSAGES_BY_CHAT_ID,
    CREATE_CHAT,
    CREATE_NEW_MESSAGE_IN_CHAT_ID,
    GET_ALL_CHATS,
    DELETE_CHAT_BY_CHAT_ID
} from '../queries/chat.query.js'

export async function getChatById(chatID, userID) {
    const client = await pool.connect();
    try {
        const result = await client.query(GET_CHAT_BY_CHAT_ID, [chatID, userID]);
        return result.rows[0];
    } catch (error) {
        throw new Error(`Error getting chat: ${error.message}`);
    } finally {
        client.release();
    }
}

export async function createNewChat(title, userID) {
    const client = await pool.connect();
    try {
        const result = await client.query(CREATE_CHAT, [title, userID])
        return result.rows[0];
    } catch (error) {
        throw new Error(`Error creating chat: ${error.message}`);
    } finally {
        client.release();
    }
}

export async function getChatMessagesByChatId(chatID, userID) {
    const client = await pool.connect();
    try {
        const result = await client.query(GET_CHAT_MESSAGES_BY_CHAT_ID, [chatID, userID]);
        return result.rows;
    } catch (error) {
        throw new Error(`Error getting chat and messages: ${error.message}`);
    } finally {
        client.release();
    }
}

export async function createNewMessageByChatId(chatID , content , role){
    const client = await pool.connect();
    try {
        const result = await client.query(CREATE_NEW_MESSAGE_IN_CHAT_ID , [chatID , content , role])
        return result.rows[0];
    } catch (error) {
        throw new Error(`Error creating new message: ${error.message}`);
    } finally {
        client.release();
    }
}

export async function getAllChats(userId) {
    const client = await pool.connect();
    try {
        const result = await client.query(GET_ALL_CHATS, [userId]);
        return result.rows;
    } catch (error) {
        throw new Error(`Error getting all chats: ${error.message}`);
    } finally {
        client.release();
    }
}

export async function deleteChatByChatId(chatID , userID) {
    const client = await pool.connect();
    try {
        const result = await client.query(DELETE_CHAT_BY_CHAT_ID , [chatID , userID]);
        return result.rowCount;
    } catch (error) {
        throw new Error(`Error deleting chat: ${error.message}`);
    } finally {
        client.release();
    }
}