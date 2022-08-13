import dotenv from 'dotenv';
dotenv.config();    
import express from 'express';
import cors from 'cors';
import GetAllCardModels from './routes/cards.mjs';
import GetFeatAndAlbum from './routes/feat.mjs';
import { handler } from '../build/handler.js';

const app = express();
app.use(cors());
app.get('/api/cards', async (req, res) => {
    const allCardsModels = await GetAllCardModels();
    res.send(allCardsModels);
});
app.get('/api/feat/:first/:second', async (req, res) => {
    const { first, second } = req.params;
    const featAndAlbum = await GetFeatAndAlbum(first, second);
    res.send(featAndAlbum);
});
app.use(handler);
app.listen(3000, () => console.log('Listening on port 3000!'));