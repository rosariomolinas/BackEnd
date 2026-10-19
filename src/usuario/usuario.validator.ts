import { isBlank, type Validator } from '../shared/validation';

export const validarLogin: Validator = (body) => {
  const errors: string[] = [];
  if (isBlank(body.user)) errors.push('Ingresá el usuario');
  if (isBlank(body.password)) errors.push('Ingresá la contraseña');
  return errors;
};

export const validarCambioPassword: Validator = (body) => {
  const errors: string[] = [];
  if (isBlank(body.user)) errors.push('Falta el usuario');
  if (isBlank(body.passwordold)) errors.push('Ingresá la contraseña actual');
  if (isBlank(body.passwordnew) || String(body.passwordnew).length < 4) {
    errors.push('La contraseña nueva debe tener al menos 4 caracteres');
  } else if (body.passwordnew === body.passwordold) {
    errors.push('La contraseña nueva debe ser distinta de la actual');
  }
  return errors;
};
