import type { NextFunction, Request, RequestHandler, Response } from 'express';

// Manejo centralizado de errores de la API.
// Todas las respuestas de error tienen la forma { data: [], message } y un código HTTP acorde.

export class ApiError extends Error {
  constructor(public status: number, message: string, public errors: string[] = []) {
    super(message);
  }
}

type AsyncHandler = (req: Request, res: Response, next: NextFunction) => Promise<unknown>;

// Envuelve un handler async para que cualquier excepción llegue al errorHandler.
export const asyncHandler = (fn: AsyncHandler): RequestHandler => (req, res, next) => {
  fn(req, res, next).catch(next);
};

export const notFound = (req: Request, res: Response) => {
  res.status(404).json({ data: [], message: `Ruta no encontrada: ${req.method} ${req.originalUrl}` });
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ApiError) {
    return res.status(err.status).json({ data: [], message: err.message, errors: err.errors });
  }
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ data: [], message: 'El cuerpo de la petición no es un JSON válido' });
  }
  if (err.name === 'ValidationError') {
    const errors = Object.values<{ message: string }>(err.errors).map((e) => e.message);
    return res.status(400).json({ data: [], message: 'Datos inválidos', errors });
  }
  if (err.name === 'CastError') {
    return res.status(400).json({ data: [], message: `Valor inválido para ${err.path}` });
  }
  console.error(err);
  return res.status(500).json({ data: [], message: 'Error interno del servidor' });
};
