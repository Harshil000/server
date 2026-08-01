import express from 'express';
import cookieParser from 'cookie-parser';
import { handleError } from './middleware/error.middleware.js'; 
import authRouter from './routes/auth.route.js';
import chatRouter from './routes/chat.route.js';
import cors from 'cors';
import morgan from 'morgan';

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));
app.use(morgan('dev'));
app.use('/api/auth', authRouter);
app.use('/api/chats' , chatRouter);

app.get('/' , (req , res) => {
    res.send('Hello World');
});

app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

app.use(handleError);

export default app;