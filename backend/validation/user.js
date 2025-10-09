
const { celebrate, Joi, Segments } = require('celebrate');
exports.updateMeV = celebrate({
  [Segments.BODY]: Joi.object({
    name: Joi.string().min(2).max(120).optional(),
    currentPassword: Joi.string().min(6).optional(),
    newPassword: Joi.string().min(6).optional()
  }).custom((v, h) => {
    if (v.newPassword && !v.currentPassword) return h.error('any.custom', 'currentPassword required');
    return v;
  })
});
