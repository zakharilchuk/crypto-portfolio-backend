import Joi from 'joi';

export const validationSchema = Joi.object({
  APP_PORT: Joi.number().default(8080),
});
