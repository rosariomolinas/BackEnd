const { crudService } = require('./crudService');
const pacientes = require('../db/pacientes');
const doctores = require('../db/doctor');
const organos = require('../db/organos');

module.exports = {
  pacienteService: crudService(pacientes, {
    label: 'Paciente',
    fields: ['nombre', 'apellido', 'edad'],
    searchFields: ['nombre', 'apellido'],
  }),
  doctorService: crudService(doctores, {
    label: 'Doctor',
    fields: ['nombre', 'apellido', 'matricula'],
    searchFields: ['nombre', 'apellido'],
  }),
  organoService: crudService(organos, {
    label: 'Órgano',
    fields: ['nombre', 'mtejido', 'msangre', 'tomo3d', 'medica', 'orden'],
  }),
};
