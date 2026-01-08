import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
dotenv.config();

const app = express();

app.use(cors({
    origin: process.env.CLIENT_URI,
    credentials: true
}));
  

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

app.listen(process.env.PORT, () => {
    console.log(`Server listening on port ${process.env.PORT}`);
})