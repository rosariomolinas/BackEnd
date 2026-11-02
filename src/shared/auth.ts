import type { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import { ApiError } from './errors';
import type { Perfil } from '../usuario/usuario.model';

// Datos del usuario que viajan dentro del JWT.
export interface Sesion {
  id: string;
  user: string;
  profile: Perfil;
}

const secreto = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret && process.env.NODE_ENV === 'production') throw new Error('Falta JWT_SECRET en el .env');
  return secret || 'secreto-solo-para-desarrollo';
};

export const firmarToken = (sesion: Sesion) => jwt.sign(sesion, secreto(), {
  expiresIn: (process.env.JWT_EXPIRES_IN || '8h') as jwt.SignOptions['expiresIn'],
});

// Exige un JWT válido en "Authorization: Bearer <token>" y deja la sesión en res.locals.sesion.
export const requireAuth: RequestHandler = (req, res, next) => {
  const header = req.headers.authorization || '';
  if (!header.startsWith('Bearer ')) return next(new ApiError(401, 'Iniciá sesión para continuar'));
  try {
    const { id, user, profile } = jwt.verify(header.slice(7), secreto()) as Sesion;
    res.locals.sesion = { id, user, profile };
    return next();
  } catch (e) {
    return next(new ApiError(401, 'La sesión expiró o no es válida. Volvé a iniciar sesión'));
  }
};

// Exige que el usuario logueado tenga alguno de los perfiles indicados (va después de requireAuth).
export const requireRole = (...perfiles: Perfil[]): RequestHandler => (req, res, next) => {
  const sesion = res.locals.sesion as Sesion | undefined;
  if (!sesion) return next(new ApiError(401, 'Iniciá sesión para continuar'));
  if (!perfiles.includes(sesion.profile)) return next(new ApiError(403, 'Tu perfil no tiene permiso para esta operación'));
  return next();
};
