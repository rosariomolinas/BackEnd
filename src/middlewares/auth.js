const usuarios = require('../db/usuarios');
const { ApiError, asyncHandler } = require('./errors');

// Toma el token del header "Authorization: Bearer <token>" o, por compatibilidad, del body.
const getToken = (req) => {
  const header = req.headers.authorization || '';
  if (header.startsWith('Bearer ')) return header.slice(7);
  return req.body && req.body.token;
};

const requireToken = asyncHandler(async (req, res, next) => {
  const token = getToken(req);
  if (!token) throw new ApiError(401, 'Falta el token de sesión');
  const usuario = await usuarios.findOne({ token });
  if (!usuario) throw new ApiError(401, 'Token no válido');
  req.usuario = usuario;
  next();
});

module.exports = { requireToken, getToken };
