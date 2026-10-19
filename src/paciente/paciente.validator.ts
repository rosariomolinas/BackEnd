import {
  isInteger, paraModificar, requiredText, type EntityValidator,
} from '../shared/validation';

export const validarPaciente: EntityValidator = (body, parcial = false) => {
  const errors: string[] = [];
  if (!parcial || body.nombre !== undefined) requiredText(body, 'nombre', 'El nombre', errors);
  if (!parcial || body.apellido !== undefined) requiredText(body, 'apellido', 'El apellido', errors);
  if (!parcial || body.edad !== undefined) {
    if (!isInteger(body.edad) || Number(body.edad) < 0 || Number(body.edad) > 130) {
      errors.push('La edad debe ser un número entre 0 y 130');
    }
  }
  return errors;
};

export const validarPacienteUpdate = paraModificar(validarPaciente);
