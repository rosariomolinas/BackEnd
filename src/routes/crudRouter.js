const express = require('express');
const { asyncHandler } = require('../middlewares/errors');
const validate = require('../middlewares/validate');
const v = require('../validators');

// Arma las rutas estándar de un CRUD (mismas URLs que usa el frontend).
// extra: middlewares por ruta, por ejemplo { findcode: [requireToken] }.
const crudRouter = (controller, { create, update }, extra = {}) => {
  const router = express.Router();
  const add = (path, validator, handler) => {
    router.post(`/${path}`, ...(extra[path] || []), validate(validator), asyncHandler(handler));
  };

  add('addnew', create, controller.addnew);
  add('findcode', v.code, controller.findCode);
  add('findname', v.nombreBusqueda, controller.findName);
  add('findall', v.nada, controller.findAll);
  add('update', update, controller.update);
  add('remove', v.code, controller.remove);
  add('next', v.code, controller.next);
  add('previous', v.code, controller.previous);
  return router;
};

module.exports = crudRouter;
