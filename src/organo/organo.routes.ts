import { CrudService } from '../shared/crud/crud.service';
import { crudController } from '../shared/crud/crud.controller';
import { crudRouter } from '../shared/crud/crud.router';
import { asyncHandler } from '../shared/errors';
import { costos } from '../shared/costos';
import { Organo, type IOrgano } from './organo.model';
import { validarOrgano, validarOrganoUpdate } from './organo.validator';

export const organoService = new CrudService<IOrgano>(Organo, {
  label: 'Órgano',
  fields: ['nombre', 'mtejido', 'msangre', 'tomo3d', 'medica', 'orden'],
});

export const organoRouter = crudRouter(
  crudController(organoService),
  { create: validarOrgano, update: validarOrganoUpdate },
);

// Órganos activos junto con los costos/tiempos configurados (lo usa la planificación de intervenciones).
organoRouter.post('/traertodos', asyncHandler(async (req, res) => {
  const lista = await organoService.findAll(true);
  res.json({ lista, valores: costos() });
}));
