import { Schema, model } from 'mongoose';
import type { EntidadBase } from '../shared/crud/crud.service';

export interface IPaciente extends EntidadBase {
  nombre: string;
  apellido: string;
  edad?: number;
}

const pacienteSchema = new Schema<IPaciente>({
  code: { type: Number, required: true, unique: true },
  nombre: { type: String, required: [true, 'El nombre es obligatorio'], trim: true },
  apellido: { type: String, required: [true, 'El apellido es obligatorio'], trim: true },
  edad: { type: Number, min: [0, 'La edad no puede ser negativa'], max: [130, 'La edad no es válida'] },
  activo: { type: Boolean, default: true },
});

export const Paciente = model<IPaciente>('pacientes', pacienteSchema);
