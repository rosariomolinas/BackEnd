import { isValidObjectId, type FilterQuery } from 'mongoose';
import { ApiError } from '../shared/errors';
import { ACTIVOS } from '../shared/crud/crud.service';
import { costos } from '../shared/costos';
import type { Sesion } from '../shared/auth';
import { Paciente } from '../paciente/paciente.model';
import { Doctor } from '../doctor/doctor.model';
import { Organo } from '../organo/organo.model';
import { Medicamento } from '../medicamento/medicamento.model';
import { Intervencion, type Estado, type IIntervencion } from './intervencion.model';
import {
  calcularPresupuesto, pasoDe, validarFechaFutura, validarResultado, validarRuta, type DatosResultado, type OrganoRuta,
} from './intervencion.reglas';

export interface FiltroIntervenciones {
  paciente?: string;
  doctor?: string;
  desde?: string;
  hasta?: string;
  estado?: Estado;
}

const UN_DIA = 24 * 60 * 60 * 1000;

const buildFiltro = ({
  paciente, doctor, desde, hasta, estado,
}: FiltroIntervenciones): FilterQuery<IIntervencion> => {
  const filtro: FilterQuery<IIntervencion> = {};
  if (paciente) filtro.paciente = Number(paciente);
  if (doctor) filtro.doctor = Number(doctor);
  if (desde || hasta) {
    filtro.fecint = {};
    if (desde) filtro.fecint.$gte = new Date(desde);
    if (hasta) filtro.fecint.$lt = new Date(new Date(hasta).getTime() + UN_DIA); // incluye el día "hasta"
  }
  // Las intervenciones viejas no tienen estado: cuentan como planificadas.
  if (estado) filtro.estado = estado === 'planificada' ? { $in: ['planificada', null] } : estado;
  return filtro;
};

const buscar = async (id: string) => {
  const doc = isValidObjectId(id) ? await Intervencion.findById(id) : null;
  if (!doc) throw new ApiError(404, 'Intervención no encontrada');
  return doc;
};

const exigirPlanificada = (doc: { estado: Estado }, accion: string) => {
  if (doc.estado !== 'planificada') {
    throw new ApiError(409, `No se puede ${accion} una intervención ${doc.estado}`);
  }
};

// Caso de uso 1: valida la planificación contra la base y recalcula costo y tiempo en el servidor.
const planificar = async (data: Record<string, any>, hoy = new Date()) => {
  const ruta = (data.ruta as Record<string, unknown>[]).map(pasoDe);
  const fecint = new Date(data.fecint);

  const [paciente, doctor, organos, medicamentos] = await Promise.all([
    Paciente.exists({ code: Number(data.paciente), ...ACTIVOS }),
    Doctor.exists({ code: Number(data.doctor), ...ACTIVOS }),
    Organo.find({ code: { $in: ruta.map((p) => p.organo) }, ...ACTIVOS }).lean<OrganoRuta[]>(),
    Medicamento.find({ code: { $in: ruta.map((p) => p.medica).filter(Boolean) }, ...ACTIVOS }).lean(),
  ]);

  const errores = [
    ...(paciente ? [] : ['El paciente no existe o está dado de baja']),
    ...(doctor ? [] : ['El doctor no existe o está dado de baja']),
    ...validarFechaFutura(fecint, hoy),
    ...validarRuta(ruta, new Map(organos.map((o) => [o.code, o])), new Set(medicamentos.map((m) => m.code))),
  ];
  if (errores.length) throw new ApiError(400, errores.join('. '), errores);

  return {
    paciente: Number(data.paciente), doctor: Number(data.doctor), fecint, ruta, ...calcularPresupuesto(ruta, costos()),
  };
};

export const intervencionService = {
  findByFiltro: (filtro: FiltroIntervenciones) => Intervencion.find(buildFiltro(filtro)).sort({ fecint: -1 }),

  findById: buscar,

  // Datos que necesita la pantalla de planificación.
  async datosPlanificacion() {
    const organos = await Organo.find(ACTIVOS).sort({ orden: 1, code: 1 });
    return { organos, valores: costos() };
  },

  create: async (data: Record<string, unknown>) => Intervencion.create(await planificar(data)),

  async update(id: string, data: Record<string, unknown>) {
    const doc = await buscar(id);
    exigirPlanificada(doc, 'modificar');
    doc.set(await planificar(data));
    return doc.save();
  },

  async remove(id: string) {
    const doc = await buscar(id);
    exigirPlanificada(doc, 'eliminar');
    await doc.deleteOne();
    return doc;
  },

  // Caso de uso 2: registrar el resultado (realizada o cancelada).
  async registrarResultado(id: string, datos: DatosResultado, sesion: Sesion, hoy = new Date()) {
    const doc = await buscar(id);
    const errores = validarResultado(doc.estado, datos, hoy);
    if (errores.length) {
      const status = doc.estado !== 'planificada' ? 409 : 400;
      throw new ApiError(status, errores.join('. '), errores);
    }
    const realizada = datos.estado === 'realizada';
    doc.estado = realizada ? 'realizada' : 'cancelada';
    doc.resultado = {
      fecha: datos.fecha ? new Date(String(datos.fecha)) : hoy,
      tiempoReal: realizada ? Number(datos.tiempoReal) : undefined,
      observaciones: typeof datos.observaciones === 'string' ? datos.observaciones.trim() : undefined,
      usuario: sesion.user,
    };
    return doc.save();
  },
};
