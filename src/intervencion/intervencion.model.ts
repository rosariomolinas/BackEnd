import { Schema, model } from 'mongoose';

// Un paso de la ruta: órgano a tratar, muestras que se toman y medicación (code, 0 = ninguna).
export interface IPasoRuta {
  organo: number;
  mtejido: boolean;
  msangre: boolean;
  tomo3d: boolean;
  medica: number;
}

// paciente, doctor y ruta[].organo guardan el "code" de cada entidad.
export interface IIntervencion {
  paciente: number;
  doctor: number;
  fecint: Date;
  costo?: number;
  tiempo?: number;
  ruta: IPasoRuta[];
}

const pasoRutaSchema = new Schema<IPasoRuta>({
  organo: { type: Number, required: true },
  mtejido: { type: Boolean, default: false },
  msangre: { type: Boolean, default: false },
  tomo3d: { type: Boolean, default: false },
  medica: { type: Number, default: 0 },
}, { _id: false });

const intervencionSchema = new Schema<IIntervencion>({
  paciente: { type: Number, required: [true, 'El paciente es obligatorio'] },
  doctor: { type: Number, required: [true, 'El doctor es obligatorio'] },
  fecint: { type: Date, required: [true, 'La fecha es obligatoria'] },
  costo: { type: Number, min: 0 },
  tiempo: { type: Number, min: 0 },
  ruta: { type: [pasoRutaSchema], default: [] },
});

export const Intervencion = model<IIntervencion>('intervenciones', intervencionSchema);
