import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
    name: "chat",
    initialState: {
        chats: {
            /*
            "Title of chat": {
                messages: [
                    { role: "user" | "AI", content: "..." }
                ],
                chatID: "id_of_chat"
            }
            */
        },
        currentChatID: null,
        loading: false,
        error: null,
    },
    reducers: {
        setChats: (state, action) => {
            if (Array.isArray(action.payload)) {
                const formattedChats = {};
                action.payload.forEach((chat) => {
                    const title = chat.title || "Untitled Chat";
                    formattedChats[title] = {
                        messages: chat.messages || [],
                        chatID: chat.chat_id || chat.chatID,
                    };
                });
                state.chats = formattedChats;
            } else {
                state.chats = action.payload || {};
            }
        },
        addChat: (state, action) => {
            const { title, chatID, messages = [] } = action.payload;
            if (!state.chats[title]) {
                state.chats[title] = {
                    messages: [...messages],
                    chatID,
                };
            } else {
                state.chats[title].chatID = chatID;
                state.chats[title].messages.push(...messages);
            }
        },
        setMessages: (state, action) => {
            const { title, chatID, messages } = action.payload;
            let targetTitle = title;
            if (!targetTitle && chatID) {
                targetTitle = Object.keys(state.chats).find(
                    (key) => state.chats[key].chatID === chatID
                );
            }
            if (targetTitle && state.chats[targetTitle]) {
                state.chats[targetTitle].messages = messages;
            }
        },
        addMessage: (state, action) => {
            const { title, chatID, message } = action.payload;
            let targetTitle = title;
            if (!targetTitle && chatID) {
                targetTitle = Object.keys(state.chats).find(
                    (key) => state.chats[key].chatID === chatID
                );
            }
            if (targetTitle && state.chats[targetTitle]) {
                state.chats[targetTitle].messages.push(message);
            }
        },
        updateStreamMessage: (state, action) => {
            const { title, chatID, content } = action.payload;
            let targetTitle = title;
            if (!targetTitle && chatID) {
                targetTitle = Object.keys(state.chats).find(
                    (key) => state.chats[key].chatID === chatID
                );
            }
            if (targetTitle && state.chats[targetTitle]) {
                const messages = state.chats[targetTitle].messages;
                const lastMsg = messages[messages.length - 1];
                if (lastMsg && lastMsg.role === "AI") {
                    lastMsg.content = content;
                } else {
                    messages.push({ role: "AI", content });
                }
            }
        },
        updateToolCall: (state, action) => {
            const { title, chatID, toolCall, active = true } = action.payload;
            let targetTitle = title;
            if (!targetTitle && chatID) {
                targetTitle = Object.keys(state.chats).find(
                    (key) => state.chats[key].chatID === chatID
                );
            }
            if (targetTitle && state.chats[targetTitle]) {
                const messages = state.chats[targetTitle].messages;
                const lastMsg = messages[messages.length - 1];
                if (lastMsg && lastMsg.role === "AI") {
                    lastMsg.toolCall = toolCall;
                    lastMsg.toolCallActive = active;
                } else {
                    messages.push({ role: "AI", content: "", toolCall, toolCallActive: active });
                }
            }
        },
        clearToolCallActive: (state, action) => {
            const { title, chatID } = action.payload;
            let targetTitle = title;
            if (!targetTitle && chatID) {
                targetTitle = Object.keys(state.chats).find(
                    (key) => state.chats[key].chatID === chatID
                );
            }
            if (targetTitle && state.chats[targetTitle]) {
                const messages = state.chats[targetTitle].messages;
                const lastMsg = messages[messages.length - 1];
                if (lastMsg && lastMsg.role === "AI") {
                    lastMsg.toolCallActive = false;
                }
            }
        },
        deleteChatInState: (state, action) => {
            const target = action.payload;
            if (state.chats[target]) {
                delete state.chats[target];
            } else {
                const keyToDelete = Object.keys(state.chats).find(
                    (key) => state.chats[key].chatID === target
                );
                if (keyToDelete) {
                    delete state.chats[keyToDelete];
                }
            }
            if (state.currentChatID === target) {
                state.currentChatID = null;
            }
        },
        setCurrentChatID: (state, action) => {
            state.currentChatID = action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        }
    }
});

export const {
    setChats,
    addChat,
    setMessages,
    addMessage,
    updateStreamMessage,
    updateToolCall,
    clearToolCallActive,
    deleteChatInState,
    setCurrentChatID,
    setLoading,
    setError
} = chatSlice.actions;

export default chatSlice.reducer;