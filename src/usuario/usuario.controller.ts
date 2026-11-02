import type { Request, Response } from 'express';
import type { Sesion } from '../shared/auth';
import { usuarioService } from './usuario.service';

const sesionDe = (res: Response) => res.locals.sesion as Sesion;

export const authController = {
  async login(req: Request, res: Response) {
    const data = await usuarioService.login(req.body.user, req.body.password);
    res.json({ data, message: 'Sesión iniciada' });
  },

  async me(req: Request, res: Response) {
    res.json({ data: sesionDe(res), message: '' });
  },

  async cambiarPassword(req: Request, res: Response) {
    await usuarioService.cambiarPassword(sesionDe(res).id, req.body.passwordActual, req.body.passwordNueva);
    res.json({ data: null, message: 'Contraseña actualizada' });
  },
};

export const usuarioController = {
  async list(req: Request, res: Response) {
    res.json({ data: await usuarioService.findAll(), message: '' });
  },

  async create(req: Request, res: Response) {
    const data = await usuarioService.create(req.body);
    res.status(201).json({ data, message: 'Usuario creado' });
  },

  async update(req: Request, res: Response) {
    const data = await usuarioService.update(req.params.id, req.body, sesionDe(res));
    res.json({ data, message: 'Usuario actualizado' });
  },

  async remove(req: Request, res: Response) {
    const data = await usuarioService.remove(req.params.id, sesionDe(res));
    res.json({ data, message: 'Usuario eliminado' });
  },
};
