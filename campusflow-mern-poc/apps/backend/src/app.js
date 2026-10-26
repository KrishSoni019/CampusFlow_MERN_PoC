import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import taskRoutes from './routes/tasks.routes.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

const app = express();
app.disable('x-powered-by');
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json({ limit: '30kb' }));
if (process.env.NODE_ENV !== 'test') app.use(morgan('dev'));
app.use('/api', rateLimit({ windowMs: 15 * 60 * 1000, limit: 300, standardHeaders: 'draft-7', legacyHeaders: false }));

app.get('/api/health', (req, res) => res.json({ success: true, message: 'CampusFlow API is running.', timestamp: new Date().toISOString() }));
app.use('/api/tasks', taskRoutes);
app.use(notFound);
app.use(errorHandler);

export default app;
