import { Router, type RequestHandler } from 'express';
import { asyncHandler } from '../errors';
import { validarCodigo, validate, type Validator } from '../validation';
import type { CrudController } from './crud.controller';

// Arma las rutas REST de un CRUD:
//   GET / (?nombre, ?todos)   GET /:code   GET /:code/siguiente   GET /:code/anterior
//   POST /   PUT /:code   DELETE /:code
// escritura: middlewares que se aplican solo a POST, PUT y DELETE (por ejemplo requireRole('admin')).
export const crudRouter = (
  controller: CrudController,
  validators: { create: Validator; update: Validator },
  escritura: RequestHandler[] = [],
) => {
  const router = Router();
  const code = validate(validarCodigo, 'params');

  router.get('/', asyncHandler(controller.list));
  router.get('/:code', code, asyncHandler(controller.get));
  router.get('/:code/siguiente', code, asyncHandler(controller.next));
  router.get('/:code/anterior', code, asyncHandler(controller.previous));
  router.post('/', ...escritura, validate(validators.create), asyncHandler(controller.create));
  router.put('/:code', ...escritura, code, validate(validators.update), asyncHandler(controller.update));
  router.delete('/:code', ...escritura, code, asyncHandler(controller.remove));
  return router;
};
