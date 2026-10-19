const {
  isBlank, isNumber, isInteger, isBoolean, isDate, requiredText, requiredCode,
} = require('./rules');

const code = (body) => {
  const errors = [];
  requiredCode(body, errors);
  return errors;
};

const nombreBusqueda = (body) => (isBlank(body.nombre) ? ['Ingresá un nombre para buscar'] : []);

const nada = () => [];

// En una modificación los campos son opcionales, pero si vienen tienen que ser válidos.
const conCode = (validator) => (body) => [...code(body), ...validator(body, true)];

const paciente = (body, parcial = false) => {
  const errors = [];
  if (!parcial || body.nombre !== undefined) requiredText(body, 'nombre', 'El nombre', errors);
  if (!parcial || body.apellido !== undefined) requiredText(body, 'apellido', 'El apellido', errors);
  if (!parcial || body.edad !== undefined) {
    if (!isInteger(body.edad) || Number(body.edad) < 0 || Number(body.edad) > 130) {
      errors.push('La edad debe ser un número entre 0 y 130');
    }
  }
  return errors;
};

const doctor = (body, parcial = false) => {
  const errors = [];
  if (!parcial || body.nombre !== undefined) requiredText(body, 'nombre', 'El nombre', errors);
  if (!parcial || body.apellido !== undefined) requiredText(body, 'apellido', 'El apellido', errors);
  if (!parcial || body.matricula !== undefined) {
    if (!isInteger(body.matricula) || Number(body.matricula) < 1) {
      errors.push('La matrícula debe ser un número entero positivo');
    }
  }
  return errors;
};

const organo = (body, parcial = false) => {
  const errors = [];
  if (!parcial || body.nombre !== undefined) requiredText(body, 'nombre', 'El nombre', errors);
  if (body.orden !== undefined && body.orden !== '' && !isInteger(body.orden)) {
    errors.push('El orden debe ser un número entero');
  }
  ['mtejido', 'msangre', 'tomo3d', 'medica'].forEach((f) => {
    if (!isBoolean(body[f])) errors.push(`${f} debe ser verdadero o falso`);
  });
  return errors;
};

const intervencion = (body) => {
  const errors = [];
  if (!isInteger(body.paciente)) errors.push('Seleccioná un paciente');
  if (!isInteger(body.doctor)) errors.push('Seleccioná un doctor');
  if (!isDate(body.fecint)) errors.push('La fecha de la intervención no es válida');
  if (body.costo !== undefined && (!isNumber(body.costo) || Number(body.costo) < 0)) errors.push('El costo no es válido');
  if (body.tiempo !== undefined && (!isNumber(body.tiempo) || Number(body.tiempo) < 0)) errors.push('El tiempo no es válido');
  if (!Array.isArray(body.ruta) || body.ruta.length === 0) errors.push('La intervención debe tener al menos un órgano');
  return errors;
};

const filtroIntervenciones = (body) => {
  const errors = [];
  if (body.paciente != null && !isInteger(body.paciente)) errors.push('El paciente del filtro no es válido');
  if (body.doctor != null && !isInteger(body.doctor)) errors.push('El doctor del filtro no es válido');
  if (body.fecdes != null && !isDate(body.fecdes)) errors.push('La fecha desde no es válida');
  if (body.fechas != null && !isDate(body.fechas)) errors.push('La fecha hasta no es válida');
  return errors;
};

const login = (body) => {
  const errors = [];
  if (isBlank(body.user)) errors.push('Ingresá el usuario');
  if (isBlank(body.password)) errors.push('Ingresá la contraseña');
  return errors;
};

const cambioPassword = (body) => {
  const errors = [];
  if (isBlank(body.user)) errors.push('Falta el usuario');
  if (isBlank(body.passwordold)) errors.push('Ingresá la contraseña actual');
  if (isBlank(body.passwordnew) || String(body.passwordnew).length < 4) {
    errors.push('La contraseña nueva debe tener al menos 4 caracteres');
  } else if (body.passwordnew === body.passwordold) {
    errors.push('La contraseña nueva debe ser distinta de la actual');
  }
  return errors;
};

module.exports = {
  code,
  nombreBusqueda,
  nada,
  paciente,
  pacienteUpdate: conCode(paciente),
  doctor,
  doctorUpdate: conCode(doctor),
  organo,
  organoUpdate: conCode(organo),
  intervencion,
  filtroIntervenciones,
  login,
  cambioPassword,
};
