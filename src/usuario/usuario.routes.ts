import { Router } from 'express';
import { asyncHandler } from '../shared/errors';
import { requireAuth, requireRole } from '../shared/auth';
import { validate } from '../shared/validation';
import { authController as a, usuarioController as u } from './usuario.controller';
import {
  validarCambioPassword, validarLogin, validarUsuario, validarUsuarioUpdate,
} from './usuario.validator';

// /auth: login (público), datos de la sesión y cambio de la propia contraseña.
export const authRouter = Router();
authRouter.post('/login', validate(validarLogin), asyncHandler(a.login));
authRouter.get('/me', requireAuth, asyncHandler(a.me));
authRouter.put('/password', requireAuth, validate(validarCambioPassword), asyncHandler(a.cambiarPassword));

// /usuarios: ABM de usuarios, solo para administradores.
export const usuarioRouter = Router();
usuarioRouter.use(requireRole('admin'));
usuarioRouter.get('/', asyncHandler(u.list));
usuarioRouter.post('/', validate(validarUsuario), asyncHandler(u.create));
usuarioRouter.put('/:id', validate(validarUsuarioUpdate), asyncHandler(u.update));
usuarioRouter.delete('/:id', asyncHandler(u.remove));
