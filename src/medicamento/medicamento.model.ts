import { Schema, model } from 'mongoose';

export interface IMedicamento {
  code: number;
  nombre: string;
}

const medicamentoSchema = new Schema<IMedicamento>({
  code: Number,
  nombre: String,
});

export const Medicamento = model<IMedicamento>('medicamentos', medicamentoSchema);
