const { ApiError } = require('./errors');

// Recibe un validador (body) => [mensajes de error] y corta la petición con 400 si hay errores.
const validate = (validator) => (req, res, next) => {
  const errors = validator(req.body || {});
  if (errors.length) {
    return next(new ApiError(400, errors.join('. '), errors));
  }
  return next();
};

module.exports = validate;
