import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import urlRoutes from './routes/urls';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Welcome route
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Welcome to the URL Sharing & AI Summarization API' });
});

// Routes
app.use('/api/v1/urls', urlRoutes);

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: any) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: 'Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

export default app; 