export default () => ({
  app: {
    port: parseInt(process.env.APP_PORT ?? '8080', 10),
    name: process.env.APP_NAME ?? 'Crypto Portfolio Tracker API',
    version: process.env.APP_VERSION ?? '1.0.0',
    accessTokenSecretKey: process.env.ACCESS_TOKEN_SECRET_KEY,
    accessTokenExpirationTime: process.env.ACCESS_TOKEN_EXPIRATION_TIME,
    refreshTokenSecretKey: process.env.REFRESH_TOKEN_SECRET_KEY,
    refreshTokenExpirationTime: process.env.REFRESH_TOKEN_EXPIRATION_TIME,
  },
  database: {
    user: process.env.POSTGRES_USER ?? 'postgres',
    password: process.env.POSTGRES_PASSWORD ?? 'password',
    name: process.env.POSTGRES_DB ?? 'crypto_portfolio',
    port: parseInt(process.env.POSTGRES_PORT ?? '5432', 10),
    host: process.env.POSTGRES_HOST ?? 'localhost',
  },
  mailer: {
    host: process.env.EMAIL_HOST!,
    username: process.env.EMAIL_USERNAME!,
    password: process.env.EMAIL_PASSWORD!,
  },
});
