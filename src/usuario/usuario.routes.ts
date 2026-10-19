import { Router } from 'express';
import { asyncHandler } from '../shared/errors';
import { validate } from '../shared/validation';
import { usuarioController as c } from './usuario.controller';
import { validarCambioPassword, validarLogin } from './usuario.validator';

export const usuarioRouter = Router();

usuarioRouter.post('/validar', validate(validarLogin), asyncHandler(c.validar));
usuarioRouter.post('/validToken', asyncHandler(c.validToken));
usuarioRouter.post('/pwdUpdate', validate(validarCambioPassword), asyncHandler(c.pwdUpdate));
usuarioRouter.post('/logout', asyncHandler(c.logout));
