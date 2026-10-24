import type { Request, Response } from 'express';
import type { Sesion } from '../shared/auth';
import { intervencionService as service, type FiltroIntervenciones } from './intervencion.service';

export const intervencionController = {
  async list(req: Request, res: Response) {
    const data = await service.findByFiltro(req.query as FiltroIntervenciones);
    res.json({ data, message: data.length ? '' : 'No hay intervenciones para ese filtro' });
  },

  async get(req: Request, res: Response) {
    res.json({ data: await service.findById(req.params.id), message: '' });
  },

  async planificacion(req: Request, res: Response) {
    res.json({ data: await service.datosPlanificacion(), message: '' });
  },

  async create(req: Request, res: Response) {
    const data = await service.create(req.body);
    res.status(201).json({ data, message: 'Intervención planificada' });
  },

  async update(req: Request, res: Response) {
    const data = await service.update(req.params.id, req.body);
    res.json({ data, message: 'Intervención actualizada' });
  },

  async remove(req: Request, res: Response) {
    const data = await service.remove(req.params.id);
    res.json({ data, message: 'Intervención eliminada' });
  },

  async registrarResultado(req: Request, res: Response) {
    const data = await service.registrarResultado(req.params.id, req.body, res.locals.sesion as Sesion);
    res.json({ data, message: `Intervención ${data.estado}` });
  },
};
