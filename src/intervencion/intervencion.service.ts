import type { FilterQuery } from 'mongoose';
import { Intervencion, type IIntervencion } from './intervencion.model';

export interface FiltroIntervenciones {
  paciente?: number | string;
  doctor?: number | string;
  fecdes?: string;
  fechas?: string;
}

const buildFiltro = ({
  paciente, doctor, fecdes, fechas,
}: FiltroIntervenciones): FilterQuery<IIntervencion> => {
  const filtro: FilterQuery<IIntervencion> = {};
  if (paciente != null) filtro.paciente = Number(paciente);
  if (doctor != null) filtro.doctor = Number(doctor);
  if (fecdes != null || fechas != null) {
    filtro.fecint = {};
    if (fecdes != null) filtro.fecint.$gte = new Date(fecdes);
    if (fechas != null) filtro.fecint.$lt = new Date(fechas);
  }
  return filtro;
};

export const intervencionService = {
  create: (data: IIntervencion) => Intervencion.create({
    paciente: data.paciente,
    doctor: data.doctor,
    fecint: data.fecint,
    costo: data.costo,
    tiempo: data.tiempo,
    ruta: data.ruta,
  }),
  findAll: () => Intervencion.find({}).sort({ fecint: -1 }),
  findByFiltro: (filtro: FiltroIntervenciones) => Intervencion.find(buildFiltro(filtro)).sort({ fecint: -1 }),
  findById: (id: string) => Intervencion.findById(id),
};
