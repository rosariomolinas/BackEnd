import type { Request, Response } from 'express';
import { ApiError } from '../errors';
import type { CrudService, EntidadBase } from './crud.service';

// "activo": true en el body significa "traer solo los activos" (lo que manda el frontend).
const soloActivos = (body: Record<string, unknown>) => body.activo === true || body.activo === 'true';

type Handler = (req: Request, res: Response) => Promise<void>;
export type CrudController = Record<
  'addnew' | 'findCode' | 'findName' | 'findAll' | 'update' | 'remove' | 'next' | 'previous',
  Handler
>;

// Controlador genérico: traduce HTTP <-> servicio. Las respuestas tienen la forma { data: [...], message }.
export const crudController = <T extends EntidadBase>(service: CrudService<T>): CrudController => ({
  addnew: async (req, res) => {
    const doc = await service.create(req.body);
    res.status(201).json({ data: [doc], message: `${service.label} guardado` });
  },

  findCode: async (req, res) => {
    const doc = await service.findByCode(req.body.code, soloActivos(req.body));
    if (!doc) throw new ApiError(404, 'No hay coincidencias');
    res.json({ data: [doc], message: '' });
  },

  findName: async (req, res) => {
    const docs = await service.findByName(req.body.nombre, soloActivos(req.body));
    res.json({ data: docs, message: docs.length ? '' : 'No hay coincidencias' });
  },

  findAll: async (req, res) => {
    const docs = await service.findAll(soloActivos(req.body));
    res.json({ data: docs, message: docs.length ? '' : 'No hay coincidencias' });
  },

  update: async (req, res) => {
    const doc = await service.update(req.body.code, req.body);
    res.json({ data: [doc], message: `${service.label} actualizado` });
  },

  remove: async (req, res) => {
    const doc = await service.remove(req.body.code);
    res.json({ data: [doc], message: `${service.label} eliminado` });
  },

  next: async (req, res) => {
    const docs = await service.next(req.body.code);
    res.json({ data: docs, message: docs.length ? '' : `No hay un ${service.label.toLowerCase()} siguiente` });
  },

  previous: async (req, res) => {
    const docs = await service.previous(req.body.code);
    res.json({ data: docs, message: docs.length ? '' : `No hay un ${service.label.toLowerCase()} anterior` });
  },
});
