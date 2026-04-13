import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import authRoutes from './routes/auth.route.js'
import userRoutes from './routes/user.route.js'
import chatRoutes from './routes/chat.route.js'
import connectDB from './config/db.js';
import cookieParser from 'cookie-parser'
import { initializeSocket } from './services/socket.js';
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URI,
        credentials: true,
        methods: ['GET', 'POST']
    }
});

connectDB();

app.use(cors({
    origin: process.env.CLIENT_URI,
    credentials: true
}));

app.use(cookieParser());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/chat', chatRoutes);

// Initialize Socket.IO handlers
initializeSocket(io);

// for testing:
app.get('/', (req, res) => {
    try{
        res.status(200).json({
            success:true,
            message:"server is running"
        });

    } catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"This is server error."
        })
    }
})

// Make io accessible to other modules
app.use((req, res, next) => {
    req.io = io;
    next();
});

server.listen(process.env.PORT || 3000, () => {
    console.log(`Server listening on port ${process.env.PORT || 3000}`);
})