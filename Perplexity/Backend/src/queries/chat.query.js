export const GET_CHAT_BY_CHAT_ID = `SELECT chat_id , title FROM chats WHERE chat_id = $1 AND user_id = $2;`

export const CREATE_CHAT = `INSERT INTO chats (title , user_id) VALUES ($1 , $2) RETURNING chat_id , title , user_id , created_at , updated_at;`

export const GET_CHAT_MESSAGES_BY_CHAT_ID = `SELECT m.message_id, m.content, m.role FROM messages m INNER JOIN chats c ON m.chat_id = c.chat_id WHERE m.chat_id = $1 AND c.user_id = $2 ORDER BY m.created_at ASC;`

export const CREATE_NEW_MESSAGE_IN_CHAT_ID = `
INSERT INTO messages (chat_id , content , role ) VALUES ($1 , $2 , $3) RETURNING content , role , chat_id;`

export const GET_ALL_CHATS = `SELECT chat_id , title FROM chats WHERE user_id = $1 ORDER BY created_at DESC;`

export const DELETE_CHAT_BY_CHAT_ID = `DELETE FROM chats WHERE chat_id = $1 AND user_id = $2;`