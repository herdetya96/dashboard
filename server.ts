import express from 'express';
import next from 'next';
import { createServer } from 'http';
import cors from 'cors';
import { initDb, setupRoutes } from './server/index';

const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

nextApp.prepare().then(async () => {
  const app = express();
  app.use(cors());
  app.use(express.json());

  // Initialize database and setup routes
  try {
    await initDb();
    setupRoutes(app);
    console.log('Database initialized and routes set up successfully');
  } catch (error) {
    console.error('Error initializing database or setting up routes:', error);
    process.exit(1);
  }

  // Handle API routes
  app.use('/api', (req, res, next) => {
    next();
  });

  // Handle Next.js requests
  app.all('*', (req, res) => {
    return handle(req, res);
  });

  const httpServer = createServer(app);
  const PORT = process.env.PORT || 3000;
  httpServer.listen(PORT, () => {
    console.log(`> Ready on http://localhost:${PORT}`);
  });
}).catch((ex) => {
  console.error(ex.stack);
  process.exit(1);
});