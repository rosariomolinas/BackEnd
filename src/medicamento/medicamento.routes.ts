import { CrudService } from '../shared/crud/crud.service';
import { crudController } from '../shared/crud/crud.controller';
import { crudRouter } from '../shared/crud/crud.router';
import { requireRole } from '../shared/auth';
import { Medicamento, type IMedicamento } from './medicamento.model';
import { validarMedicamento, validarMedicamentoUpdate } from './medicamento.validator';

export const medicamentoService = new CrudService<IMedicamento>(Medicamento, {
  label: 'Medicamento',
  fields: ['nombre'],
});

// Cualquier usuario logueado consulta; el ABM de medicamentos es del administrador.
export const medicamentoRouter = crudRouter(
  crudController(medicamentoService),
  { create: validarMedicamento, update: validarMedicamentoUpdate },
  [requireRole('admin')],
);
