import {
  isBoolean, isInteger, paraModificar, requiredText, type EntityValidator,
} from '../shared/validation';

export const validarOrgano: EntityValidator = (body, parcial = false) => {
  const errors: string[] = [];
  if (!parcial || body.nombre !== undefined) requiredText(body, 'nombre', 'El nombre', errors);
  if (body.orden !== undefined && body.orden !== '' && !isInteger(body.orden)) {
    errors.push('El orden debe ser un número entero');
  }
  ['mtejido', 'msangre', 'tomo3d', 'medica'].forEach((f) => {
    if (!isBoolean(body[f])) errors.push(`${f} debe ser verdadero o falso`);
  });
  return errors;
};

export const validarOrganoUpdate = paraModificar(validarOrgano);
