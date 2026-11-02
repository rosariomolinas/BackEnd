import { Schema, model } from 'mongoose';
import type { EntidadBase } from '../shared/crud/crud.service';

export interface IMedicamento extends EntidadBase {
  nombre: string;
}

const medicamentoSchema = new Schema<IMedicamento>({
  code: { type: Number, required: true, unique: true },
  nombre: { type: String, required: [true, 'El nombre es obligatorio'], trim: true },
  activo: { type: Boolean, default: true },
});

export const Medicamento = model<IMedicamento>('medicamentos', medicamentoSchema);
