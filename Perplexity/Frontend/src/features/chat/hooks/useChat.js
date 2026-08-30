import { getAllChats, getMessages, sendMessageStream, deleteChat } from "../service/chat.service.js";
import { useDispatch, useSelector } from "react-redux";
import {
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
    setError,
} from "../chat.slice.js";

const useChat = () => {
    const dispatch = useDispatch();
    const { chats = {}, currentChatID = null, loading = false, error = null } = useSelector((state) => state.chat || {});

    const getAllChatsHandler = async () => {
        try {
            dispatch(setLoading(true));
            const response = await getAllChats();
            const rawChats = response?.chats || response;
            dispatch(setChats(rawChats));
            dispatch(setLoading(false));
        } catch (err) {
            dispatch(setError(err?.message || err));
            dispatch(setLoading(false));
        }
    };

    const getMessagesHandler = async (chatID, title) => {
        try {
            dispatch(setLoading(true));
            const response = await getMessages(chatID);
            const messages = response?.messages || response;
            const chatTitle = title || response?.chat?.title;
            dispatch(setMessages({ chatID, title: chatTitle, messages }));
            dispatch(setLoading(false));
        } catch (err) {
            dispatch(setError(err?.message || err));
            dispatch(setLoading(false));
        }
    };

    const sendMessageHandler = async (message, chatID, files = []) => {
        try {
            dispatch(setLoading(true));

            let targetChatID = chatID;
            let targetFiles = files;

            if (Array.isArray(chatID)) {
                targetFiles = chatID;
                targetChatID = currentChatID;
            }

            let accumulativeText = "";
            let chatTitle = "Untitled Chat";
            let activeChatID = targetChatID;
            let chatInitialized = false;

            // Delegate stream reading and SSE parsing to chat.service.js
            await sendMessageStream(message, targetChatID, targetFiles, (data) => {
                if (data.type === "init") {
                    chatTitle = data.title || chatTitle;
                    activeChatID = data.chatID || activeChatID;

                    if (!chatInitialized) {
                        const existingKey = Object.keys(chats).find(
                            (key) => key === chatTitle || chats[key].chatID === activeChatID
                        );

                        if (existingKey && chats[existingKey]) {
                            dispatch(
                                addMessage({
                                    title: existingKey,
                                    chatID: activeChatID,
                                    message: { role: "user", content: message },
                                })
                            );
                            dispatch(
                                addMessage({
                                    title: existingKey,
                                    chatID: activeChatID,
                                    message: { role: "AI", content: "" },
                                })
                            );
                        } else {
                            dispatch(
                                addChat({
                                    title: chatTitle,
                                    chatID: activeChatID,
                                    messages: [
                                        { role: "user", content: message },
                                        { role: "AI", content: "" },
                                    ],
                                })
                            );
                        }
                        chatInitialized = true;
                        dispatch(setCurrentChatID(activeChatID));
                    }
                } else if (data.type === "token") {
                    accumulativeText += data.token;
                    dispatch(
                        updateStreamMessage({
                            title: chatTitle,
                            chatID: activeChatID,
                            content: accumulativeText,
                        })
                    );
                    dispatch(
                        clearToolCallActive({
                            title: chatTitle,
                            chatID: activeChatID,
                        })
                    );
                } else if (data.type === "tool") {
                    console.log("Agent Executing Tool:", data.toolCall);
                    dispatch(
                        updateToolCall({
                            title: chatTitle,
                            chatID: activeChatID,
                            toolCall: data.toolCall,
                            active: true,
                        })
                    );
                } else if (data.type === "done") {
                    dispatch(
                        clearToolCallActive({
                            title: chatTitle,
                            chatID: activeChatID,
                        })
                    );
                    if (data.response) {
                        accumulativeText = data.response;
                        dispatch(
                            updateStreamMessage({
                                title: chatTitle,
                                chatID: activeChatID,
                                content: accumulativeText,
                            })
                        );
                    }
                }
            });

            dispatch(setLoading(false));
            return { success: true, title: chatTitle, chatID: activeChatID };
        } catch (err) {
            dispatch(setError(err?.message || err));
            dispatch(setLoading(false));
            console.log("Streaming message error:", err);
        }
    };

    const deleteChatHandler = async (chatID) => {
        try {
            dispatch(setLoading(true));
            const response = await deleteChat(chatID);
            dispatch(deleteChatInState(chatID));
            dispatch(setLoading(false));
            return response;
        } catch (err) {
            dispatch(setError(err?.message || err));
            dispatch(setLoading(false));
            console.log(err);
        }
    };

    const setCurrentChatIDHandler = (chatID) => {
        dispatch(setCurrentChatID(chatID));
    };

    return {
        chats,
        currentChatID,
        loading,
        error,
        getAllChatsHandler,
        getMessagesHandler,
        sendMessageHandler,
        deleteChatHandler,
        setCurrentChatID: setCurrentChatIDHandler,
    };
};

export default useChat;