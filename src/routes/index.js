const express = require('express');
const crudRouter = require('./crudRouter');
const crudController = require('../controllers/crudController');
const orgController = require('../controllers/orgController');
const medicaController = require('../controllers/medicaController');
const intervController = require('../controllers/intervController');
const usuController = require('../controllers/usuController');
const { pacienteService, doctorService } = require('../services');
const { asyncHandler } = require('../middlewares/errors');
const { requireToken } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const v = require('../validators');

const router = express.Router();

router.use('/pac', crudRouter(
  crudController(pacienteService),
  { create: v.paciente, update: v.pacienteUpdate },
  { findcode: [requireToken] },
));

router.use('/doctor', crudRouter(
  crudController(doctorService),
  { create: v.doctor, update: v.doctorUpdate },
));

const orgRouter = crudRouter(orgController, { create: v.organo, update: v.organoUpdate });
orgRouter.post('/traertodos', asyncHandler(orgController.traertodos));
router.use('/org', orgRouter);

const medicaRouter = express.Router();
medicaRouter.post('/traertodos', asyncHandler(medicaController.traertodos));
router.use('/medica', medicaRouter);

const intervRouter = express.Router();
intervRouter.post('/addnew', validate(v.intervencion), asyncHandler(intervController.addnew));
intervRouter.post('/findcode', asyncHandler(intervController.findCode));
intervRouter.post('/traertodos', asyncHandler(intervController.traertodos));
intervRouter.post('/traeralgunos', validate(v.filtroIntervenciones), asyncHandler(intervController.traeralgunos));
router.use('/interv', intervRouter);

const usuRouter = express.Router();
usuRouter.post('/validar', validate(v.login), asyncHandler(usuController.validar));
usuRouter.post('/validToken', asyncHandler(usuController.validToken));
usuRouter.post('/pwdUpdate', validate(v.cambioPassword), asyncHandler(usuController.pwdUpdate));
usuRouter.post('/logout', asyncHandler(usuController.logout));
router.use('/usuarios', usuRouter);

module.exports = router;
