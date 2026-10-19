const crypto = require('node:crypto');
const usuarios = require('../db/usuarios');
const { ApiError } = require('../middlewares/errors');
const { getToken } = require('../middlewares/auth');

// Login: si usuario y contraseña coinciden genera un token nuevo y lo devuelve con el perfil.
const validar = async (req, res) => {
  const { user, password } = req.body;
  const token = crypto.randomBytes(20).toString('hex');
  const usuario = await usuarios.findOneAndUpdate({ user, password }, { token }, { new: true });
  if (!usuario) throw new ApiError(401, 'Usuario o clave incorrectos');
  res.json({
    data: true, token, user: usuario.user, profile: usuario.profile, message: 'Usuario válido',
  });
};

const validToken = async (req, res) => {
  const token = getToken(req);
  const usuario = token ? await usuarios.findOne({ token }) : null;
  if (!usuario) throw new ApiError(401, 'Token no válido');
  res.json({ data: true, user: usuario.user, profile: usuario.profile });
};

const pwdUpdate = async (req, res) => {
  const { user, passwordold, passwordnew } = req.body;
  const result = await usuarios.updateOne({ user, password: passwordold }, { password: passwordnew });
  if (!result.matchedCount) throw new ApiError(400, 'La contraseña actual es incorrecta');
  res.json({ data: true, message: 'Contraseña actualizada' });
};

// Invalida el token del usuario.
const logout = async (req, res) => {
  const token = getToken(req);
  if (token) await usuarios.updateOne({ token }, { $unset: { token: 1 } });
  res.json({ data: true, message: 'Sesión cerrada' });
};

module.exports = {
  validar, validToken, pwdUpdate, logout,
};
