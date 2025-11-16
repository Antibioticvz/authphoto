export default () => ({
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  apiPrefix: process.env.API_PREFIX || 'api/v1',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  logging: {
    level: process.env.LOG_LEVEL || 'debug',
  },
  cache: {
    ttl: parseInt(process.env.CACHE_TTL || '30', 10),
  },
});
