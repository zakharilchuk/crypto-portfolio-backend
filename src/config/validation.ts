import Joi from 'joi';

export const validationSchema = Joi.object({
  APP_PORT: Joi.number().default(8080),
  POSTGRES_USER: Joi.string().required(),
  POSTGRES_PASSWORD: Joi.string().required(),
  POSTGRES_DB: Joi.string().required(),
  POSTGRES_PORT: Joi.number().default(5432),
  POSTGRES_HOST: Joi.string().default('localhost'),
});
