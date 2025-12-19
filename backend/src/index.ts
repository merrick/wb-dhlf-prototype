/**
 * Digital Health Competency Framework API Server
 * Version: 1.0.0
 */

import express from 'express';
import cors from 'cors';
import { domainsRouter } from './routes/domains';
import { competenciesRouter } from './routes/competencies';
import { rolesRouter } from './routes/roles';
import { learningModulesRouter } from './routes/learning-modules';
import mappingsRouter from './routes/mappings';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'DHLF API is running', version: '1.0.0' });
});

// API Routes
app.use('/api/domains', domainsRouter);
app.use('/api/competencies', competenciesRouter);
app.use('/api/roles', rolesRouter);
app.use('/api/learning-modules', learningModulesRouter);
app.use('/api/mappings', mappingsRouter);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`🚀 DHLF API server running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
});