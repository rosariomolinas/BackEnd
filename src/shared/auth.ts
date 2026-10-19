import type { Request } from 'express';
import { Usuario } from '../usuario/usuario.model';
import { ApiError, asyncHandler } from './errors';

// Toma el token del header "Authorization: Bearer <token>" o, por compatibilidad, del body.
export const getToken = (req: Request): string | undefined => {
  const header = req.headers.authorization || '';
  if (header.startsWith('Bearer ')) return header.slice(7);
  return req.body && req.body.token;
};

export const requireToken = asyncHandler(async (req, res, next) => {
  const token = getToken(req);
  if (!token) throw new ApiError(401, 'Falta el token de sesión');
  const usuario = await Usuario.findOne({ token });
  if (!usuario) throw new ApiError(401, 'Token no válido');
  res.locals.usuario = usuario;
  next();
});
