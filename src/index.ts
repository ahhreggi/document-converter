import express, { Request, Response } from 'express';
import { documentRoutes } from './routes';

const app = express();

app.use(express.json());

app.use('/document', documentRoutes);

app.use((error: Error, req: Request, res: Response) => {
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(3000, () =>
  console.log(`Server is running on http://localhost:3000`)
);
