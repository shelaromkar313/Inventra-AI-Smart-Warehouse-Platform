import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import inventoryRoutes from './routes/inventory.routes';
import alertRoutes from './routes/alert.routes';
import aiRoutes from './routes/ai.routes';
import initDb from './config/initDb';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CLI DB Initialization
if (process.argv.includes('--init-db')) {
  initDb().then(() => {
    console.log('Exiting after DB init.');
    process.exit(0);
  });
}

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/inventory', inventoryRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/ai', aiRoutes);

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Smart Warehouse AI Platform API (TypeScript) v1' });
});

app.listen(PORT, () => {
  console.log(`[server]: Server is running at http://localhost:${PORT}`);
});
