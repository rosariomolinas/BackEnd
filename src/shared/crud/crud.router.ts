import { Router, type RequestHandler } from 'express';
import { asyncHandler } from '../errors';
import {
  sinValidacion, validarCodigo, validarNombreBusqueda, validate, type Validator,
} from '../validation';
import type { CrudController } from './crud.controller';

type Ruta = 'addnew' | 'findcode' | 'findname' | 'findall' | 'update' | 'remove' | 'next' | 'previous';

// Arma las rutas estándar de un CRUD (mismas URLs que usa el frontend).
// extra: middlewares por ruta, por ejemplo { findcode: [requireToken] }.
export const crudRouter = (
  controller: CrudController,
  validators: { create: Validator; update: Validator },
  extra: Partial<Record<Ruta, RequestHandler[]>> = {},
) => {
  const router = Router();
  const add = (path: Ruta, validator: Validator, handler: CrudController[keyof CrudController]) => {
    router.post(`/${path}`, ...(extra[path] || []), validate(validator), asyncHandler(handler));
  };

  add('addnew', validators.create, controller.addnew);
  add('findcode', validarCodigo, controller.findCode);
  add('findname', validarNombreBusqueda, controller.findName);
  add('findall', sinValidacion, controller.findAll);
  add('update', validators.update, controller.update);
  add('remove', validarCodigo, controller.remove);
  add('next', validarCodigo, controller.next);
  add('previous', validarCodigo, controller.previous);
  return router;
};
