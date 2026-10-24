import {
  isDate, isInteger, type Validator,
} from '../shared/validation';
import { ESTADOS } from './intervencion.model';

// Forma de los datos; las reglas que necesitan la base están en el servicio y en intervencion.reglas.ts.
export const validarIntervencion: Validator = (body) => {
  const errors: string[] = [];
  if (!isInteger(body.paciente)) errors.push('Seleccioná un paciente');
  if (!isInteger(body.doctor)) errors.push('Seleccioná un doctor');
  if (!isDate(body.fecint)) errors.push('La fecha de la intervención no es válida');
  if (!Array.isArray(body.ruta) || body.ruta.length === 0) {
    errors.push('La intervención debe tener al menos un órgano');
  } else if (body.ruta.some((p: Record<string, unknown>) => !p || !isInteger(p.organo))) {
    errors.push('Cada paso de la ruta debe indicar un órgano');
  }
  return errors;
};

export const validarFiltroIntervenciones: Validator = (query) => {
  const errors: string[] = [];
  if (query.paciente && !isInteger(query.paciente)) errors.push('El paciente del filtro no es válido');
  if (query.doctor && !isInteger(query.doctor)) errors.push('El doctor del filtro no es válido');
  if (query.desde && !isDate(query.desde)) errors.push('La fecha desde no es válida');
  if (query.hasta && !isDate(query.hasta)) errors.push('La fecha hasta no es válida');
  if (query.estado && !ESTADOS.includes(query.estado)) errors.push('El estado del filtro no es válido');
  return errors;
};
