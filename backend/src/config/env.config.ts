export const envConfig = () => ({
  port: parseInt(process.env.PORT ?? '3000', 10) || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  jwt: {
    secret: process.env.JWT_SECRET || 'fallback-secret-key-only-for-dev',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
  },
  database: {
    path: process.env.DATABASE_PATH || 'database.sqlite',
  },
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  },
});