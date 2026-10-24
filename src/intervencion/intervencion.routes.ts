import { Router } from 'express';
import { asyncHandler } from '../shared/errors';
import { requireRole } from '../shared/auth';
import { validate } from '../shared/validation';
import { intervencionController as c } from './intervencion.controller';
import { validarFiltroIntervenciones, validarIntervencion } from './intervencion.validator';

export const intervencionRouter = Router();
const soloUser = requireRole('user');

// Consultas: cualquier usuario logueado. Planificar, modificar, eliminar y registrar resultado: perfil "user".
intervencionRouter.get('/', validate(validarFiltroIntervenciones, 'query'), asyncHandler(c.list));
intervencionRouter.get('/planificacion', asyncHandler(c.planificacion));
intervencionRouter.get('/:id', asyncHandler(c.get));
intervencionRouter.post('/', soloUser, validate(validarIntervencion), asyncHandler(c.create));
intervencionRouter.put('/:id', soloUser, validate(validarIntervencion), asyncHandler(c.update));
intervencionRouter.delete('/:id', soloUser, asyncHandler(c.remove));
intervencionRouter.patch('/:id/resultado', soloUser, asyncHandler(c.registrarResultado));
