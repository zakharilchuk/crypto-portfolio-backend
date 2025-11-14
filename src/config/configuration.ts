export default () => ({
  app: {
    port: parseInt(process.env.APP_PORT ?? '8080', 10),
  },
  database: {
    user: process.env.POSTGRES_USER ?? 'postgres',
    password: process.env.POSTGRES_PASSWORD ?? 'password',
    name: process.env.POSTGRES_DB ?? 'crypto_portfolio',
    port: parseInt(process.env.POSTGRES_PORT ?? '5432', 10),
    host: process.env.POSTGRES_HOST ?? 'localhost',
  },
});
