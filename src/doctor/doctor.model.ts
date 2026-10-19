import { Schema, model } from 'mongoose';
import type { EntidadBase } from '../shared/crud/crud.service';

export interface IDoctor extends EntidadBase {
  nombre: string;
  apellido: string;
  matricula: number;
}

const doctorSchema = new Schema<IDoctor>({
  code: { type: Number, required: true, unique: true },
  nombre: { type: String, required: [true, 'El nombre es obligatorio'], trim: true },
  apellido: { type: String, required: [true, 'El apellido es obligatorio'], trim: true },
  matricula: { type: Number, required: [true, 'La matrícula es obligatoria'], min: 1 },
  activo: { type: Boolean, default: true },
});

export const Doctor = model<IDoctor>('doctores', doctorSchema);
