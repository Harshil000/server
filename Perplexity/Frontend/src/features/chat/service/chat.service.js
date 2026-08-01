import axios from 'axios'

const api = axios.create({
    baseURL: "http://localhost:3000/api/chats",
    withCredentials: true
})

export const getAllChats = async () => {
    try {
        const response = await api.get("/all-chats");
        return response.data;
    } catch (error) {
        return error;
    }
}

export const getMessages = async (chatId) => {
    try {
        const response = await api.get(`/${chatId}/messages`);
        return response.data;
    } catch (error) {
        return error;
    }
}

/**
 * Service function to handle real-time SSE stream reading using Axios onDownloadProgress.
 * Completely eliminates native fetch while maintaining 100% Axios compatibility.
 */
export const sendMessageStream = async (message, chatID, files = [], onEvent) => {
    try {
        let actualFiles = files;
        let actualOnEvent = onEvent;
        if (typeof files === "function") {
            actualOnEvent = files;
            actualFiles = [];
        }

        let payload;
        if (actualFiles && actualFiles.length > 0) {
            payload = new FormData();
            payload.append("message", message || "");
            if (chatID) payload.append("chatID", chatID);
            actualFiles.forEach((file) => {
                payload.append("files", file);
            });
        } else {
            payload = { message, chatID };
        }

        let lastIndex = 0;

        await api.post("/message", payload, {
            headers: {
                Accept: "text/event-stream",
            },
            onDownloadProgress: (progressEvent) => {
                const responseText =
                    progressEvent.event?.currentTarget?.responseText ||
                    progressEvent.event?.target?.responseText ||
                    "";

                const newChunk = responseText.slice(lastIndex);
                lastIndex = responseText.length;

                const lines = newChunk.split("\n\n");
                for (const line of lines) {
                    if (line.startsWith("data: ")) {
                        try {
                            const eventData = JSON.parse(line.slice(6));
                            if (actualOnEvent) actualOnEvent(eventData);
                        } catch (e) {
                            // ignore partial JSON parse errors
                        }
                    }
                }
            },
        });
    } catch (error) {
        throw error;
    }
}

export const deleteChat = async (chatId) => {
    try {
        const response = await api.delete(`/${chatId}`);
        return response.data;
    } catch (error) {
        return error;
    }
}