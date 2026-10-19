// Reglas simples reutilizables por los validadores de cada entidad.
const isBlank = (v) => v === undefined || v === null || String(v).trim() === '';
const isNumber = (v) => !isBlank(v) && !Number.isNaN(Number(v));
const isInteger = (v) => isNumber(v) && Number.isInteger(Number(v));
const isBoolean = (v) => v === undefined || typeof v === 'boolean';
const isDate = (v) => !isBlank(v) && !Number.isNaN(new Date(v).getTime());

const requiredText = (body, field, label, errors) => {
  if (isBlank(body[field])) errors.push(`${label} es obligatorio`);
  else if (typeof body[field] !== 'string') errors.push(`${label} debe ser texto`);
};

const requiredCode = (body, errors) => {
  if (!isInteger(body.code) || Number(body.code) < 1) errors.push('El código debe ser un número entero positivo');
};

module.exports = { isBlank, isNumber, isInteger, isBoolean, isDate, requiredText, requiredCode };
