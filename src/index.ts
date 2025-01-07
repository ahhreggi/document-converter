import express, { Request, Response } from 'express';
import { documentRoutes } from './routes';

const app = express();

// Middleware for parsing JSON
app.use(express.json());

// Document-related routes
app.use('/document', documentRoutes);

// Global error handler
app.use((error: Error, req: Request, res: Response) => {
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(3000, () =>
  console.log(`Server is running on http://localhost:3000`)
);
