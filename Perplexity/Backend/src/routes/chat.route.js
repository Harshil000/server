import { Router } from "express";
import multer from "multer";
import { sendMessage, getAllChats, getAllMessagesOfChat, deleteChat } from "../controller/chat.controller.js";
import { authenticateToken } from "../middleware/auth.middleware.js";

const chatRouter = Router();
const upload = multer({ storage: multer.memoryStorage() });

chatRouter.post('/message', authenticateToken, upload.array("files"), sendMessage);

chatRouter.get('/all-chats', authenticateToken, getAllChats);

chatRouter.get('/:chatID/messages', authenticateToken, getAllMessagesOfChat);

chatRouter.delete('/:chatID', authenticateToken, deleteChat);

export default chatRouter;