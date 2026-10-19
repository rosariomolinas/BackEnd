// Manejo centralizado de errores de la API.
// Todas las respuestas de error tienen la forma { data: [], message } y un código HTTP acorde.

class ApiError extends Error {
  constructor(status, message, errors = []) {
    super(message);
    this.status = status;
    this.errors = errors;
  }
}

// Envuelve un handler async para que cualquier excepción llegue al errorHandler.
const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

const notFound = (req, res) => {
  res.status(404).json({ data: [], message: `Ruta no encontrada: ${req.method} ${req.originalUrl}` });
};

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  if (err instanceof ApiError) {
    return res.status(err.status).json({ data: [], message: err.message, errors: err.errors });
  }
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ data: [], message: 'El cuerpo de la petición no es un JSON válido' });
  }
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ data: [], message: 'Datos inválidos', errors });
  }
  if (err.name === 'CastError') {
    return res.status(400).json({ data: [], message: `Valor inválido para ${err.path}` });
  }
  console.error(err);
  return res.status(500).json({ data: [], message: 'Error interno del servidor' });
};

module.exports = { ApiError, asyncHandler, notFound, errorHandler };
