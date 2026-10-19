import { Router } from 'express';
import { asyncHandler } from '../shared/errors';
import { validate } from '../shared/validation';
import { intervencionController as c } from './intervencion.controller';
import { validarFiltroIntervenciones, validarIntervencion } from './intervencion.validator';

export const intervencionRouter = Router();

intervencionRouter.post('/addnew', validate(validarIntervencion), asyncHandler(c.addnew));
intervencionRouter.post('/findcode', asyncHandler(c.findCode));
intervencionRouter.post('/traertodos', asyncHandler(c.traertodos));
intervencionRouter.post('/traeralgunos', validate(validarFiltroIntervenciones), asyncHandler(c.traeralgunos));
