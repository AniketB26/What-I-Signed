import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import logger from './utils/logger.js';
import { generalLimiter } from './middleware/rateLimit.middleware.js';

// Route imports
import authRoutes from './routes/auth.routes.js';
import documentRoutes from './routes/document.routes.js';
import queryRoutes from './routes/query.routes.js';
import alertRoutes from './routes/alert.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';

const app = express();

// Behind nginx or a PaaS router, the client IP arrives in X-Forwarded-For and
// the original scheme in X-Forwarded-Proto. Without this, express-rate-limit
// buckets every request under the proxy's IP and `secure` cookies are dropped.
app.set('trust proxy', Number(process.env.TRUST_PROXY_HOPS) || 1);

// ── Security & parsing ──
app.use(helmet());

// CLIENT_URL accepts a comma-separated list so preview/staging origins can be
// allowed alongside production without a rebuild.
const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Same-origin requests and non-browser clients (curl, health probes)
      // arrive without an Origin header.
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error(`Origin ${origin} is not allowed by CORS`));
    },
    credentials: true,
  })
);
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ── Logging ──
app.use(
  morgan('dev', {
    stream: { write: (msg) => logger.http(msg.trim()) },
  })
);

// ── Rate limiting ──
app.use('/api', generalLimiter);

// ── Health check ──
app.get('/api/health', (_req, res) => {
  res.json({ success: true, data: { status: 'ok', timestamp: new Date().toISOString() }, message: 'Server is healthy' });
});

// ── Routes ──
app.use('/api/auth', authRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/query', queryRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/dashboard', dashboardRoutes);

// ── 404 handler ──
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    data: null,
    message: 'Route not found',
  });
});

// ── Global error handler ──
app.use((err, _req, res, _next) => {
  // Multer file size error
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({
      success: false,
      data: null,
      message: 'File too large. Maximum size is 20MB.',
    });
  }

  // Multer file filter error
  if (err.message && err.message.includes('Unsupported file type')) {
    return res.status(400).json({
      success: false,
      data: null,
      message: err.message,
    });
  }

  const statusCode = err.statusCode || 500;
  const message = statusCode === 500 ? 'Internal server error' : err.message;

  logger.error('Unhandled error', {
    error: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    statusCode,
  });

  res.status(statusCode).json({
    success: false,
    data: null,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

export default app;
