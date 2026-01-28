import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/auth.route.js'
import userRoutes from './routes/user.route.js'
import chatRoutes from './routes/chat.route.js'
import connectDB from './config/db.js';
import cookieParser from 'cookie-parser'
dotenv.config();

const app = express();

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


app.listen(process.env.PORT || 3000, () => {
    console.log(`Server listening on port ${process.env.PORT || 3000}`);
})