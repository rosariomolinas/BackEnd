import { isBlank, type Validator } from '../shared/validation';
import { PERFILES } from './usuario.model';

export const MIN_PASSWORD = 4;

const validarPassword = (password: unknown, label: string, errors: string[]) => {
  if (typeof password !== 'string' || password.length < MIN_PASSWORD) {
    errors.push(`${label} debe tener al menos ${MIN_PASSWORD} caracteres`);
  }
};

const validarPerfil = (profile: unknown, errors: string[]) => {
  if (!PERFILES.includes(profile as never)) errors.push(`El perfil debe ser ${PERFILES.join(' o ')}`);
};

export const validarLogin: Validator = (body) => {
  const errors: string[] = [];
  // typeof evita que llegue un objeto (por ejemplo { $ne: null }) a la consulta de Mongo.
  if (isBlank(body.user) || typeof body.user !== 'string') errors.push('Ingresá el usuario');
  if (isBlank(body.password) || typeof body.password !== 'string') errors.push('Ingresá la contraseña');
  return errors;
};

export const validarCambioPassword: Validator = (body) => {
  const errors: string[] = [];
  if (isBlank(body.passwordActual) || typeof body.passwordActual !== 'string') errors.push('Ingresá la contraseña actual');
  validarPassword(body.passwordNueva, 'La contraseña nueva', errors);
  if (!errors.length && body.passwordNueva === body.passwordActual) {
    errors.push('La contraseña nueva debe ser distinta de la actual');
  }
  return errors;
};

export const validarUsuario: Validator = (body) => {
  const errors: string[] = [];
  if (isBlank(body.user) || typeof body.user !== 'string') errors.push('El usuario es obligatorio');
  else if (!/^[a-zA-Z0-9._-]{3,30}$/.test(String(body.user))) {
    errors.push('El usuario debe tener entre 3 y 30 letras, números, punto, guion o guion bajo');
  }
  validarPassword(body.password, 'La contraseña', errors);
  validarPerfil(body.profile, errors);
  return errors;
};

// Al modificar un usuario se puede cambiar el perfil y, opcionalmente, blanquear la contraseña.
export const validarUsuarioUpdate: Validator = (body) => {
  const errors: string[] = [];
  if (body.profile !== undefined) validarPerfil(body.profile, errors);
  if (body.password !== undefined && body.password !== '') validarPassword(body.password, 'La contraseña', errors);
  return errors;
};
