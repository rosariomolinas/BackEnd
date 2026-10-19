import type { Request, Response } from 'express';
import { ApiError } from '../shared/errors';
import { costos } from '../shared/costos';
import { intervencionService } from './intervencion.service';

export const intervencionController = {
  async traertodos(req: Request, res: Response) {
    const lista = await intervencionService.findAll();
    res.json({ lista, valores: costos() });
  },

  async traeralgunos(req: Request, res: Response) {
    const data = await intervencionService.findByFiltro(req.body);
    res.json({ data, message: data.length ? '' : 'No hay intervenciones para ese filtro' });
  },

  async addnew(req: Request, res: Response) {
    const doc = await intervencionService.create(req.body);
    res.status(201).json({ data: [doc], message: 'Datos de la intervención guardados' });
  },

  async findCode(req: Request, res: Response) {
    const doc = await intervencionService.findById(req.body.id);
    if (!doc) throw new ApiError(404, 'Intervención no encontrada');
    res.json({ data: [doc], message: '' });
  },
};
