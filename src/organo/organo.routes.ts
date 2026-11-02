import { CrudService } from '../shared/crud/crud.service';
import { crudController } from '../shared/crud/crud.controller';
import { crudRouter } from '../shared/crud/crud.router';
import { requireRole } from '../shared/auth';
import { Organo, type IOrgano } from './organo.model';
import { validarOrgano, validarOrganoUpdate } from './organo.validator';

export const organoService = new CrudService<IOrgano>(Organo, {
  label: 'Órgano',
  fields: ['nombre', 'mtejido', 'msangre', 'tomo3d', 'medica', 'orden'],
});

// Cualquier usuario logueado consulta; el ABM de órganos es del administrador.
export const organoRouter = crudRouter(
  crudController(organoService),
  { create: validarOrgano, update: validarOrganoUpdate },
  [requireRole('admin')],
);
