import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import connectDB from './config/db';
import algorandRoutes from './routes/algorandRoutes';
import { env } from './config/environment';

const app: Express = express();
const PORT = env.PORT;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/algorand', algorandRoutes);

app.get('/', (_req: Request, res: Response) => {
    res.status(200).json({msg:'Algo-Sender API is running...'});
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
