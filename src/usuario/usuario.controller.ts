import { randomBytes } from 'node:crypto';
import type { Request, Response } from 'express';
import { ApiError } from '../shared/errors';
import { getToken } from '../shared/auth';
import { Usuario } from './usuario.model';

export const usuarioController = {
  // Login: si usuario y contraseña coinciden genera un token nuevo y lo devuelve con el perfil.
  async validar(req: Request, res: Response) {
    const { user, password } = req.body;
    const token = randomBytes(20).toString('hex');
    const usuario = await Usuario.findOneAndUpdate({ user, password }, { token }, { new: true });
    if (!usuario) throw new ApiError(401, 'Usuario o clave incorrectos');
    res.json({
      data: true, token, user: usuario.user, profile: usuario.profile, message: 'Usuario válido',
    });
  },

  async validToken(req: Request, res: Response) {
    const token = getToken(req);
    const usuario = token ? await Usuario.findOne({ token }) : null;
    if (!usuario) throw new ApiError(401, 'Token no válido');
    res.json({ data: true, user: usuario.user, profile: usuario.profile });
  },

  async pwdUpdate(req: Request, res: Response) {
    const { user, passwordold, passwordnew } = req.body;
    const result = await Usuario.updateOne({ user, password: passwordold }, { password: passwordnew });
    if (!result.matchedCount) throw new ApiError(400, 'La contraseña actual es incorrecta');
    res.json({ data: true, message: 'Contraseña actualizada' });
  },

  // Invalida el token del usuario.
  async logout(req: Request, res: Response) {
    const token = getToken(req);
    if (token) await Usuario.updateOne({ token }, { $unset: { token: 1 } });
    res.json({ data: true, message: 'Sesión cerrada' });
  },
};
