
const { celebrate, Joi, Segments } = require('celebrate');
exports.createV = celebrate({
  [Segments.BODY]: Joi.object({
    title: Joi.string().min(3).max(120).required(),
    description: Joi.string().allow('').max(5000),
    startingPrice: Joi.number().min(0).required(),
    endDate: Joi.date().greater('now').required()
  })
});
exports.updateV = celebrate({
  [Segments.BODY]: Joi.object({
    title: Joi.string().min(3).max(120),
    description: Joi.string().allow('').max(5000),
    startingPrice: Joi.number().min(0),
    currentPrice: Joi.number().min(0),
    endDate: Joi.date().greater('now'),
    status: Joi.string().valid('ACTIVE','ENDED')
  })
});
