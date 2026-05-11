import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from './config/env';
import { errorHandler } from './middleware/errorHandler';
import { notFoundHandler } from './middleware/notFoundHandler';
import { apiRouter } from './routes';

export function createApp() {
  const app = express();
  const corsOptions =
    config.nodeEnv === 'production'
      ? {
          origin: config.corsOrigins
        }
      : {
          origin: true
        };

  app.use(helmet());
  app.use(cors(corsOptions));
  app.use(express.json({ limit: '1mb' }));
  app.use(morgan(config.nodeEnv === 'production' ? 'combined' : 'dev'));

  app.get('/health', (_req, res) => {
    res.json({
      success: true,
      service: 'commercepulse-360-api',
      mode: config.useMockData ? 'mock' : 'salesforce',
      timestamp: new Date().toISOString()
    });
  });

  app.use('/api', apiRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
