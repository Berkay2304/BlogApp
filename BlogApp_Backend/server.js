import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.js';
import postRoutes from './routes/posts.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api', authRoutes);
app.use('/api/posts', postRoutes);

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB bağlantısı başarılı."))
    .catch(err => console.error("MongoDB bağlantısı gerçekleştirilemedi. Error: ", err));

app.get("/", ( req, res ) => {
    res.send("Server çalışıyor.");
});    

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
   console.log(`Server ${PORT} portunda çalışıyor`);
});