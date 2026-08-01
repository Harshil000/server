CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    
    verified BOOLEAN DEFAULT false,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE chats (
    chat_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    title VARCHAR(50) NOT NULL,
    
    user_id UUID NOT NULL,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

CREATE TABLE messages (
	message_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	chat_id UUID NOT NULL,
	content TEXT,
	role : ,
	CONSTRAINT fk_chat
		FOREIGN KEY (chat_id)
		REFERENCES chat
)

SELECT * FROM users
SELECT * FROM chats
SELECT * FROM messages
DELETE FROM users WHERE username = 'Harsh_il06';