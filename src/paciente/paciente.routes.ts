import { CrudService } from '../shared/crud/crud.service';
import { crudController } from '../shared/crud/crud.controller';
import { crudRouter } from '../shared/crud/crud.router';
import { requireRole } from '../shared/auth';
import { Paciente, type IPaciente } from './paciente.model';
import { validarPaciente, validarPacienteUpdate } from './paciente.validator';

export const pacienteService = new CrudService<IPaciente>(Paciente, {
  label: 'Paciente',
  fields: ['nombre', 'apellido', 'edad'],
  searchFields: ['nombre', 'apellido'],
});

// Cualquier usuario logueado consulta; el alta, la modificación y la baja son del perfil "user".
export const pacienteRouter = crudRouter(
  crudController(pacienteService),
  { create: validarPaciente, update: validarPacienteUpdate },
  [requireRole('user')],
);
