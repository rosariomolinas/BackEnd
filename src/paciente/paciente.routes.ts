import { CrudService } from '../shared/crud/crud.service';
import { crudController } from '../shared/crud/crud.controller';
import { crudRouter } from '../shared/crud/crud.router';
import { requireToken } from '../shared/auth';
import { Paciente, type IPaciente } from './paciente.model';
import { validarPaciente, validarPacienteUpdate } from './paciente.validator';

export const pacienteService = new CrudService<IPaciente>(Paciente, {
  label: 'Paciente',
  fields: ['nombre', 'apellido', 'edad'],
  searchFields: ['nombre', 'apellido'],
});

export const pacienteRouter = crudRouter(
  crudController(pacienteService),
  { create: validarPaciente, update: validarPacienteUpdate },
  { findcode: [requireToken] },
);
