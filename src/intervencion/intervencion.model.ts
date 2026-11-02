import { Schema, model } from 'mongoose';

// Un paso de la ruta: órgano a tratar, muestras que se toman y medicación (code, 0 = ninguna).
export interface IPasoRuta {
  organo: number;
  mtejido: boolean;
  msangre: boolean;
  tomo3d: boolean;
  medica: number;
}

export const ESTADOS = ['planificada', 'realizada', 'cancelada'] as const;
export type Estado = typeof ESTADOS[number];

// Lo que se registra al cerrar la intervención (caso de uso "Registrar resultado").
export interface IResultado {
  fecha: Date;
  tiempoReal?: number;
  observaciones?: string;
  usuario: string;
}

// paciente, doctor y ruta[].organo guardan el "code" de cada entidad.
export interface IIntervencion {
  paciente: number;
  doctor: number;
  fecint: Date;
  costo: number;
  tiempo: number;
  ruta: IPasoRuta[];
  estado: Estado;
  resultado?: IResultado;
}

const pasoRutaSchema = new Schema<IPasoRuta>({
  organo: { type: Number, required: true },
  mtejido: { type: Boolean, default: false },
  msangre: { type: Boolean, default: false },
  tomo3d: { type: Boolean, default: false },
  medica: { type: Number, default: 0 },
}, { _id: false });

const resultadoSchema = new Schema<IResultado>({
  fecha: { type: Date, required: true },
  tiempoReal: { type: Number, min: 1 },
  observaciones: { type: String, trim: true },
  usuario: { type: String, required: true },
}, { _id: false });

const intervencionSchema = new Schema<IIntervencion>({
  paciente: { type: Number, required: [true, 'El paciente es obligatorio'] },
  doctor: { type: Number, required: [true, 'El doctor es obligatorio'] },
  fecint: { type: Date, required: [true, 'La fecha es obligatoria'] },
  costo: { type: Number, min: 0, default: 0 },
  tiempo: { type: Number, min: 0, default: 0 },
  ruta: { type: [pasoRutaSchema], default: [] },
  // Las intervenciones cargadas antes de existir este campo se leen como "planificada" (default).
  estado: { type: String, enum: ESTADOS, default: 'planificada' },
  resultado: resultadoSchema,
});

export const Intervencion = model<IIntervencion>('intervenciones', intervencionSchema);
