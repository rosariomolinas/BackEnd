import {
  isDate, isInteger, isNumber, type Validator,
} from '../shared/validation';

export const validarIntervencion: Validator = (body) => {
  const errors: string[] = [];
  if (!isInteger(body.paciente)) errors.push('Seleccioná un paciente');
  if (!isInteger(body.doctor)) errors.push('Seleccioná un doctor');
  if (!isDate(body.fecint)) errors.push('La fecha de la intervención no es válida');
  if (body.costo !== undefined && (!isNumber(body.costo) || Number(body.costo) < 0)) errors.push('El costo no es válido');
  if (body.tiempo !== undefined && (!isNumber(body.tiempo) || Number(body.tiempo) < 0)) errors.push('El tiempo no es válido');
  if (!Array.isArray(body.ruta) || body.ruta.length === 0) errors.push('La intervención debe tener al menos un órgano');
  return errors;
};

export const validarFiltroIntervenciones: Validator = (body) => {
  const errors: string[] = [];
  if (body.paciente != null && !isInteger(body.paciente)) errors.push('El paciente del filtro no es válido');
  if (body.doctor != null && !isInteger(body.doctor)) errors.push('El doctor del filtro no es válido');
  if (body.fecdes != null && !isDate(body.fecdes)) errors.push('La fecha desde no es válida');
  if (body.fechas != null && !isDate(body.fechas)) errors.push('La fecha hasta no es válida');
  return errors;
};
