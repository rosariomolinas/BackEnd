import { Router } from 'express';
import { asyncHandler } from '../shared/errors';
import { Medicamento } from './medicamento.model';

export const medicamentoRouter = Router();

// Devuelve el array de medicamentos (formato que consume el frontend).
medicamentoRouter.post('/traertodos', asyncHandler(async (req, res) => {
  res.json(await Medicamento.find({}).sort({ code: 1 }));
}));
