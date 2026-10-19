import { CrudService } from '../shared/crud/crud.service';
import { crudController } from '../shared/crud/crud.controller';
import { crudRouter } from '../shared/crud/crud.router';
import { Doctor, type IDoctor } from './doctor.model';
import { validarDoctor, validarDoctorUpdate } from './doctor.validator';

export const doctorService = new CrudService<IDoctor>(Doctor, {
  label: 'Doctor',
  fields: ['nombre', 'apellido', 'matricula'],
  searchFields: ['nombre', 'apellido'],
});

export const doctorRouter = crudRouter(
  crudController(doctorService),
  { create: validarDoctor, update: validarDoctorUpdate },
);
