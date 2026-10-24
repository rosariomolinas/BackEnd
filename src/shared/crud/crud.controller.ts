import type { Request, Response } from 'express';
import { ApiError } from '../errors';
import type { CrudService, EntidadBase } from './crud.service';

// ?todos=true incluye los registros dados de baja; por defecto se listan solo los activos.
const soloActivos = (req: Request) => req.query.todos !== 'true';

type Handler = (req: Request, res: Response) => Promise<void>;
export type CrudController = Record<'list' | 'get' | 'create' | 'update' | 'remove' | 'next' | 'previous', Handler>;

// Controlador genérico: traduce HTTP <-> servicio. Las respuestas tienen la forma { data, message }.
export const crudController = <T extends EntidadBase>(service: CrudService<T>): CrudController => ({
  // GET /?nombre=texto busca por nombre; sin nombre trae todos.
  list: async (req, res) => {
    const { nombre } = req.query;
    const docs = typeof nombre === 'string' && nombre.trim()
      ? await service.findByName(nombre, soloActivos(req))
      : await service.findAll(soloActivos(req));
    res.json({ data: docs, message: docs.length ? '' : 'No hay coincidencias' });
  },

  get: async (req, res) => {
    const doc = await service.findByCode(req.params.code, soloActivos(req));
    if (!doc) throw new ApiError(404, `${service.label} no encontrado`);
    res.json({ data: doc, message: '' });
  },

  create: async (req, res) => {
    const doc = await service.create(req.body);
    res.status(201).json({ data: doc, message: `${service.label} guardado` });
  },

  update: async (req, res) => {
    const doc = await service.update(req.params.code, req.body);
    res.json({ data: doc, message: `${service.label} actualizado` });
  },

  remove: async (req, res) => {
    const doc = await service.remove(req.params.code);
    res.json({ data: doc, message: `${service.label} eliminado` });
  },

  next: async (req, res) => {
    const doc = await service.next(req.params.code);
    if (!doc) throw new ApiError(404, `No hay un ${service.label.toLowerCase()} siguiente`);
    res.json({ data: doc, message: '' });
  },

  previous: async (req, res) => {
    const doc = await service.previous(req.params.code);
    if (!doc) throw new ApiError(404, `No hay un ${service.label.toLowerCase()} anterior`);
    res.json({ data: doc, message: '' });
  },
});
