import {
  isInteger, paraModificar, requiredText, type EntityValidator,
} from '../shared/validation';

export const validarDoctor: EntityValidator = (body, parcial = false) => {
  const errors: string[] = [];
  if (!parcial || body.nombre !== undefined) requiredText(body, 'nombre', 'El nombre', errors);
  if (!parcial || body.apellido !== undefined) requiredText(body, 'apellido', 'El apellido', errors);
  if (!parcial || body.matricula !== undefined) {
    if (!isInteger(body.matricula) || Number(body.matricula) < 1) {
      errors.push('La matrícula debe ser un número entero positivo');
    }
  }
  return errors;
};

export const validarDoctorUpdate = paraModificar(validarDoctor);
