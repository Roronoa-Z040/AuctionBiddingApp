
const { celebrate, Joi, Segments } = require('celebrate');
exports.placeV = celebrate({
  [Segments.BODY]: Joi.object({ amount: Joi.number().min(0.01).required() })
});
