import Joi from 'joi';

export const validationSchema = Joi.object({
  APP_PORT: Joi.number().default(8080),
  APP_NAME: Joi.string().default('Crypto Portfolio Tracker API'),
  APP_VERSION: Joi.string().default('1.0.0'),
  ACCESS_TOKEN_SECRET_KEY: Joi.string().required(),
  ACCESS_TOKEN_EXPIRATION_TIME: Joi.string().required(),
  REFRESH_TOKEN_SECRET_KEY: Joi.string().required(),
  REFRESH_TOKEN_EXPIRATION_TIME: Joi.string().required(),
  POSTGRES_USER: Joi.string().default('postgres'),
  POSTGRES_PASSWORD: Joi.string().default('password'),
  POSTGRES_DB: Joi.string().default('crypto_portfolio'),
  POSTGRES_PORT: Joi.number().default(5432),
  POSTGRES_HOST: Joi.string().default('localhost'),
  EMAIL_HOST: Joi.string().required(),
  EMAIL_USERNAME: Joi.string().required(),
  EMAIL_PASSWORD: Joi.string().required(),
});
