import Joi from 'joi';

export const validationSchema = Joi.object({
  APP_PORT: Joi.number().default(8080),
  POSTGRES_USER: Joi.string().default('postgres'),
  POSTGRES_PASSWORD: Joi.string().default('password'),
  POSTGRES_DB: Joi.string().default('crypto_portfolio'),
  POSTGRES_PORT: Joi.number().default(5432),
  POSTGRES_HOST: Joi.string().default('localhost'),
});
