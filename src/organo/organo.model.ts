import { Schema, model } from 'mongoose';
import type { EntidadBase } from '../shared/crud/crud.service';

// mtejido, msangre y tomo3d indican qué muestras admite el órgano; medica si admite medicación.
export interface IOrgano extends EntidadBase {
  nombre: string;
  mtejido: boolean;
  msangre: boolean;
  tomo3d: boolean;
  medica: boolean;
  orden?: number;
}

const organoSchema = new Schema<IOrgano>({
  code: { type: Number, required: true, unique: true },
  nombre: { type: String, required: [true, 'El nombre es obligatorio'], trim: true },
  mtejido: { type: Boolean, default: false },
  msangre: { type: Boolean, default: false },
  tomo3d: { type: Boolean, default: false },
  medica: { type: Boolean, default: false },
  orden: Number,
  activo: { type: Boolean, default: true },
});

export const Organo = model<IOrgano>('organos', organoSchema);
