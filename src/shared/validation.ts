import type { RequestHandler } from 'express';
import { ApiError } from './errors';

export type Body = Record<string, any>;
export type Validator = (body: Body) => string[];

// Corta la petición con 400 si el validador devuelve errores.
// source indica qué parte del request se valida: el body, los parámetros de la URL o el query string.
export const validate = (validator: Validator, source: 'body' | 'params' | 'query' = 'body'): RequestHandler => (
  (req, res, next) => {
    const errors = validator(req[source] || {});
    if (errors.length) return next(new ApiError(400, errors.join('. '), errors));
    return next();
  }
);

// Reglas simples reutilizables por los validadores de cada entidad.
export const isBlank = (v: unknown) => v === undefined || v === null || String(v).trim() === '';
export const isNumber = (v: unknown) => !isBlank(v) && !Number.isNaN(Number(v));
export const isInteger = (v: unknown) => isNumber(v) && Number.isInteger(Number(v));
export const isBoolean = (v: unknown) => v === undefined || typeof v === 'boolean';
export const isDate = (v: unknown) => !isBlank(v) && !Number.isNaN(new Date(v as string).getTime());

export const requiredText = (body: Body, field: string, label: string, errors: string[]) => {
  if (isBlank(body[field])) errors.push(`${label} es obligatorio`);
  else if (typeof body[field] !== 'string') errors.push(`${label} debe ser texto`);
};

export const validarCodigo: Validator = (body) => (
  !isInteger(body.code) || Number(body.code) < 1 ? ['El código debe ser un número entero positivo'] : []
);

// Validador de entidad: en una modificación (parcial) los campos son opcionales, pero si vienen tienen que ser válidos.
export type EntityValidator = (body: Body, parcial?: boolean) => string[];

export const paraModificar = (validator: EntityValidator): Validator => (body) => validator(body, true);
